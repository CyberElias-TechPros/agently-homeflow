export type D1Database = any;

export async function queryAll<T>(db: D1Database, sql: string, params: any[] = []): Promise<T[]> {
  const stmt = db.prepare(sql);
  const result = await stmt.bind(...params).all();
  return result.results as T[];
}

export async function queryOne<T>(db: D1Database, sql: string, params: any[] = []): Promise<T | null> {
  const stmt = db.prepare(sql);
  const result = await stmt.bind(...params).first();
  return (result as T) || null;
}

export async function execute(db: D1Database, sql: string, params: any[] = []): Promise<any> {
  const stmt = db.prepare(sql);
  return stmt.bind(...params).run();
}

export async function batchExecute(db: D1Database, statements: { sql: string; params?: any[] }[]): Promise<void> {
  const batch = statements.map(s => db.prepare(s.sql).bind(...(s.params || [])));
  await db.batch(batch);
}

export function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function stringifyJSON(value: any): string {
  return JSON.stringify(value);
}

// Helper to build WHERE clauses safely
export function buildFilters(filters: Record<string, any>, allowedFields: string[]): { where: string; params: any[] } {
  const clauses: string[] = [];
  const params: any[] = [];
  
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '' || value === 'all') continue;
    if (!allowedFields.includes(key)) continue;
    clauses.push(`${key} = ?`);
    params.push(value);
  }
  
  return {
    where: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params
  };
}
