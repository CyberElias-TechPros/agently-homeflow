import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { queryAll, queryOne } from '../lib/db';

type Variables = { user: AuthContext };
const analytics = new Hono<{ Bindings: Env; Variables: Variables }>();

analytics.get('/summary', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    
    // Build property filter based on role
    let propertyFilter = '';
    let propertyParams: any[] = [];
    
    if (user.role === 'owner') {
      propertyFilter = 'WHERE owner_id = ?';
      propertyParams = [user.userId];
    } else if (user.role === 'manager') {
      propertyFilter = 'WHERE manager_id = ? OR owner_id = ?';
      propertyParams = [user.userId, user.userId];
    }

    // Get properties
    const properties = await queryAll<any>(c.env.DB, `SELECT id FROM properties ${propertyFilter}`, propertyParams);
    const propertyIds = properties.map(p => p.id);

    let propertyIdFilter = '';
    let filterParams: any[] = [];
    if (propertyIds.length > 0) {
      propertyIdFilter = `WHERE property_id IN (${propertyIds.map(() => '?').join(',')})`;
      filterParams = propertyIds;
    } else if (user.role === 'owner' || user.role === 'manager') {
      // No properties, return empty stats
      return c.json({
        success: true,
        data: {
          totalProperties: 0,
          totalUnits: 0,
          occupiedUnits: 0,
          vacantUnits: 0,
          maintenanceUnits: 0,
          occupancyRate: 0,
          totalTenants: 0,
          paidTenants: 0,
          owingTenants: 0,
          unpaidTenants: 0,
          totalRevenue: 0,
          totalExpenses: 0,
          netIncome: 0,
          collectionRate: 0,
          pendingMaintenance: 0,
          inProgressMaintenance: 0,
          completedMaintenance: 0,
        }
      });
    }

    // Units
    const unitsSql = propertyIds.length > 0 
      ? `SELECT status, rent FROM units WHERE property_id IN (${propertyIds.map(() => '?').join(',')})`
      : 'SELECT status, rent FROM units';
    const units = await queryAll<any>(c.env.DB, unitsSql, propertyIds.length > 0 ? propertyIds : []);

    const totalUnits = units.length;
    const occupiedUnits = units.filter(u => u.status === 'occupied').length;
    const vacantUnits = units.filter(u => u.status === 'vacant').length;
    const maintenanceUnits = units.filter(u => u.status === 'maintenance').length;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    // Tenants
    const tenantsSql = propertyIds.length > 0
      ? `SELECT payment_status, rent_amount, balance FROM tenants WHERE property_id IN (${propertyIds.map(() => '?').join(',')}) AND status = 'active'`
      : 'SELECT payment_status, rent_amount, balance FROM tenants WHERE status = ?';
    const tenantsParams = propertyIds.length > 0 ? propertyIds : ['active'];
    const tenants = await queryAll<any>(c.env.DB, tenantsSql, tenantsParams);

    const totalTenants = tenants.length;
    const paidTenants = tenants.filter(t => t.payment_status === 'paid').length;
    const owingTenants = tenants.filter(t => t.payment_status === 'owing').length;
    const unpaidTenants = tenants.filter(t => t.payment_status === 'unpaid').length;

    // Payments
    const paymentsSql = propertyIds.length > 0
      ? `SELECT amount, status FROM payments WHERE property_id IN (${propertyIds.map(() => '?').join(',')})`
      : 'SELECT amount, status FROM payments';
    const payments = await queryAll<any>(c.env.DB, paymentsSql, propertyIds.length > 0 ? propertyIds : []);

    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const totalRentExpected = tenants.reduce((sum, t) => sum + (t.rent_amount || 0), 0);
    const collectionRate = totalRentExpected > 0 ? Math.round((totalRevenue / totalRentExpected) * 100) : 0;

    // Expenses
    const expensesSql = propertyIds.length > 0
      ? `SELECT amount FROM expenses WHERE property_id IN (${propertyIds.map(() => '?').join(',')})`
      : 'SELECT amount FROM expenses';
    const expenses = await queryAll<any>(c.env.DB, expensesSql, propertyIds.length > 0 ? propertyIds : []);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Maintenance
    const maintenanceSql = propertyIds.length > 0
      ? `SELECT status FROM maintenance_requests WHERE property_id IN (${propertyIds.map(() => '?').join(',')})`
      : 'SELECT status FROM maintenance_requests';
    const maintenance = await queryAll<any>(c.env.DB, maintenanceSql, propertyIds.length > 0 ? propertyIds : []);

    const pendingMaintenance = maintenance.filter(m => m.status === 'pending').length;
    const inProgressMaintenance = maintenance.filter(m => m.status === 'in_progress' || m.status === 'assigned').length;
    const completedMaintenance = maintenance.filter(m => m.status === 'completed').length;

    return c.json({
      success: true,
      data: {
        totalProperties: properties.length,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        occupancyRate,
        totalTenants,
        paidTenants,
        owingTenants,
        unpaidTenants,
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        collectionRate,
        pendingMaintenance,
        inProgressMaintenance,
        completedMaintenance,
        totalOutstanding: tenants.filter(t => t.payment_status !== 'paid').reduce((sum, t) => sum + (t.balance || 0), 0),
      }
    });
  } catch (error: any) {
    console.error('Analytics summary error:', error);
    return c.json({ error: 'Failed to fetch analytics', details: error.message }, 500);
  }
});

analytics.get('/revenue', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const period = c.req.query('period') || '6m';

    // Get properties for user
    let propertyIds: string[] = [];
    if (user.role === 'owner' || user.role === 'manager') {
      const props = await queryAll<any>(c.env.DB, 
        user.role === 'owner' ? 'SELECT id FROM properties WHERE owner_id = ?' : 'SELECT id FROM properties WHERE manager_id = ? OR owner_id = ?',
        user.role === 'owner' ? [user.userId] : [user.userId, user.userId]
      );
      propertyIds = props.map(p => p.id);
    }

    // Monthly revenue for last 6 months
    const months = 6;
    const revenueTrend = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
      const monthName = date.toLocaleString('default', { month: 'short' });

      let paymentSql = 'SELECT amount FROM payments WHERE status = ? AND payment_date >= ? AND payment_date <= ?';
      let paymentParams: any[] = ['completed', monthStart, monthEnd];

      if (propertyIds.length > 0) {
        paymentSql += ` AND property_id IN (${propertyIds.map(() => '?').join(',')})`;
        paymentParams = [...paymentParams, ...propertyIds];
      }

      const monthPayments = await queryAll<any>(c.env.DB, paymentSql, paymentParams);
      const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);

      let expenseSql = 'SELECT amount FROM expenses WHERE date >= ? AND date <= ?';
      let expenseParams: any[] = [monthStart, monthEnd];
      if (propertyIds.length > 0) {
        expenseSql += ` AND property_id IN (${propertyIds.map(() => '?').join(',')})`;
        expenseParams = [...expenseParams, ...propertyIds];
      }

      const monthExpenses = await queryAll<any>(c.env.DB, expenseSql, expenseParams);
      const expenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

      revenueTrend.push({
        month: monthName,
        revenue: Math.round(revenue / 1000),
        expenses: Math.round(expenses / 1000),
        net: Math.round((revenue - expenses) / 1000),
        revenueRaw: revenue,
        expensesRaw: expenses,
      });
    }

    // Revenue by property
    let revenueByProperty: any[] = [];
    if (propertyIds.length > 0) {
      const props = await queryAll<any>(c.env.DB, `SELECT id, name FROM properties WHERE id IN (${propertyIds.map(() => '?').join(',')})`, propertyIds);
      for (const prop of props) {
        const propPayments = await queryAll<any>(c.env.DB, 'SELECT amount FROM payments WHERE property_id = ? AND status = ?', [prop.id, 'completed']);
        const revenue = propPayments.reduce((sum, p) => sum + p.amount, 0);
        revenueByProperty.push({
          name: prop.name,
          revenue: revenue / 1000,
          revenueRaw: revenue,
        });
      }
    } else {
      const props = await queryAll<any>(c.env.DB, 'SELECT id, name FROM properties LIMIT 10', []);
      for (const prop of props) {
        const propPayments = await queryAll<any>(c.env.DB, 'SELECT amount FROM payments WHERE property_id = ? AND status = ?', [prop.id, 'completed']);
        const revenue = propPayments.reduce((sum, p) => sum + p.amount, 0);
        revenueByProperty.push({
          name: prop.name,
          revenue: revenue / 1000,
          revenueRaw: revenue,
        });
      }
    }

    return c.json({
      success: true,
      data: {
        revenueTrend,
        revenueByProperty,
      }
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch revenue analytics', details: error.message }, 500);
  }
});

analytics.get('/occupancy', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    let propertyIds: string[] = [];

    if (user.role === 'owner' || user.role === 'manager') {
      const props = await queryAll<any>(c.env.DB,
        user.role === 'owner' ? 'SELECT id FROM properties WHERE owner_id = ?' : 'SELECT id FROM properties WHERE manager_id = ? OR owner_id = ?',
        user.role === 'owner' ? [user.userId] : [user.userId, user.userId]
      );
      propertyIds = props.map(p => p.id);
    }

    const months = 6;
    const occupancyTrend = [];
    const now = new Date();

    // For demo, generate realistic occupancy trend
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      occupancyTrend.push({
        month: monthName,
        occupancy: 70 + Math.random() * 25,
      });
    }

    return c.json({
      success: true,
      data: { occupancyTrend }
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch occupancy analytics', details: error.message }, 500);
  }
});

export default analytics;
