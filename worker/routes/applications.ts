import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { generateId, nowISO } from '../lib/auth';
import { queryAll, queryOne, execute, parseJSON, stringifyJSON } from '../lib/db';

type Variables = { user: AuthContext };
const applications = new Hono<{ Bindings: Env; Variables: Variables }>();

applications.get('/', authMiddleware, async (c) => {
  try {
    const status = c.req.query('status') || '';
    let sql = `
      SELECT a.*, p.name as property_name, u.unit_number,
             reviewer.first_name as reviewer_first, reviewer.last_name as reviewer_last
      FROM applications a
      LEFT JOIN properties p ON a.property_id = p.id
      LEFT JOIN units u ON a.unit_id = u.id
      LEFT JOIN users reviewer ON a.reviewed_by = reviewer.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (status && status !== 'all') {
      conditions.push('a.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY a.created_at DESC LIMIT 100';

    const rows = await queryAll<any>(c.env.DB, sql, params);
    return c.json({ success: true, data: rows.map(mapRow) });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch applications', details: error.message }, 500);
  }
});

applications.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const row = await queryOne<any>(c.env.DB, `
      SELECT a.*, p.name as property_name, u.unit_number
      FROM applications a
      LEFT JOIN properties p ON a.property_id = p.id
      LEFT JOIN units u ON a.unit_id = u.id
      WHERE a.id = ?
    `, [id]);

    if (!row) return c.json({ error: 'Application not found' }, 404);
    return c.json({ success: true, data: mapRow(row) });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch application', details: error.message }, 500);
  }
});

applications.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { propertyId, unitId, firstName, lastName, email, phone, employmentStatus, monthlyIncome, moveInDate, references } = body;

    if (!propertyId || !unitId || !firstName || !lastName || !email) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const id = generateId();
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO applications (id, property_id, unit_id, first_name, last_name, email, phone, employment_status, monthly_income, move_in_date, references_text, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `, [id, propertyId, unitId, firstName, lastName, email, phone || '', employmentStatus || '', monthlyIncome || 0, moveInDate || now, references || '', now, now]);

    const created = await queryOne(c.env.DB, 'SELECT * FROM applications WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(created as any) }, 201);
  } catch (error: any) {
    return c.json({ error: 'Failed to create application', details: error.message }, 500);
  }
});

applications.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const user = c.get('user');

    const existing = await queryOne(c.env.DB, 'SELECT id FROM applications WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Application not found' }, 404);

    const fields: string[] = [];
    const params: any[] = [];

    if (body.status) {
      fields.push('status = ?');
      params.push(body.status);
    }
    if (body.score !== undefined) {
      fields.push('score = ?');
      params.push(body.score);
    }
    if (body.reviewNotes) {
      fields.push('review_notes = ?');
      params.push(body.reviewNotes);
    }

    if (body.status) {
      fields.push('reviewed_by = ?');
      params.push(user.userId);
    }

    if (fields.length === 0) return c.json({ error: 'No fields to update' }, 400);

    fields.push('updated_at = ?');
    params.push(nowISO());
    params.push(id);

    await execute(c.env.DB, `UPDATE applications SET ${fields.join(', ')} WHERE id = ?`, params);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM applications WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to update application', details: error.message }, 500);
  }
});

function mapRow(row: any) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitId: row.unit_id,
    applicantId: row.applicant_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    employmentStatus: row.employment_status,
    employerName: row.employer_name,
    monthlyIncome: row.monthly_income,
    moveInDate: row.move_in_date,
    references: row.references_text,
    kycDocuments: parseJSON(row.kyc_documents, []),
    status: row.status,
    score: row.score,
    reviewedBy: row.reviewed_by,
    reviewNotes: row.review_notes,
    propertyName: row.property_name,
    unitNumber: row.unit_number,
    reviewerFirstName: row.reviewer_first,
    reviewerLastName: row.reviewer_last,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default applications;
