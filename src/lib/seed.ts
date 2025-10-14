// Seed data for demo purposes
import { add, Property, Unit, Tenant, Payment, MaintenanceRequest, Expense } from "./db";

export async function seedDemoData() {
  try {
    // Sample Properties
    const properties: Property[] = [
      {
        id: "prop-1",
        name: "Sunset Apartments",
        address: "123 Ocean Drive, Victoria Island, Lagos",
        type: "apartment",
        units: 12,
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: "prop-2",
        name: "Green Valley Estate",
        address: "45 Lekki-Epe Expressway, Lagos",
        type: "house",
        units: 8,
        createdAt: new Date("2024-02-20").toISOString(),
      },
      {
        id: "prop-3",
        name: "Downtown Office Complex",
        address: "78 Marina Street, Lagos Island",
        type: "office",
        units: 15,
        createdAt: new Date("2024-03-10").toISOString(),
      },
    ];

    // Sample Units
    const units: Unit[] = [
      // Sunset Apartments units
      { id: "unit-1", propertyId: "prop-1", unitNumber: "A101", bedrooms: 2, bathrooms: 2, rent: 250000, status: "occupied", tenantId: "tenant-1", createdAt: new Date().toISOString() },
      { id: "unit-2", propertyId: "prop-1", unitNumber: "A102", bedrooms: 3, bathrooms: 2, rent: 350000, status: "occupied", tenantId: "tenant-2", createdAt: new Date().toISOString() },
      { id: "unit-3", propertyId: "prop-1", unitNumber: "A103", bedrooms: 2, bathrooms: 1, rent: 220000, status: "vacant", createdAt: new Date().toISOString() },
      { id: "unit-4", propertyId: "prop-1", unitNumber: "A104", bedrooms: 3, bathrooms: 2, rent: 350000, status: "occupied", tenantId: "tenant-3", createdAt: new Date().toISOString() },
      
      // Green Valley Estate units
      { id: "unit-5", propertyId: "prop-2", unitNumber: "House 1", bedrooms: 4, bathrooms: 3, rent: 800000, status: "occupied", tenantId: "tenant-4", createdAt: new Date().toISOString() },
      { id: "unit-6", propertyId: "prop-2", unitNumber: "House 2", bedrooms: 4, bathrooms: 3, rent: 800000, status: "vacant", createdAt: new Date().toISOString() },
      { id: "unit-7", propertyId: "prop-2", unitNumber: "House 3", bedrooms: 5, bathrooms: 4, rent: 1200000, status: "occupied", tenantId: "tenant-5", createdAt: new Date().toISOString() },
      
      // Downtown Office Complex units
      { id: "unit-8", propertyId: "prop-3", unitNumber: "Suite 201", rent: 450000, status: "occupied", tenantId: "tenant-6", createdAt: new Date().toISOString() },
      { id: "unit-9", propertyId: "prop-3", unitNumber: "Suite 202", rent: 350000, status: "maintenance", createdAt: new Date().toISOString() },
      { id: "unit-10", propertyId: "prop-3", unitNumber: "Suite 203", rent: 500000, status: "vacant", createdAt: new Date().toISOString() },
    ];

    // Sample Tenants
    const tenants: Tenant[] = [
      {
        id: "tenant-1",
        unitId: "unit-1",
        propertyId: "prop-1",
        firstName: "Chioma",
        lastName: "Okonkwo",
        email: "chioma.okonkwo@email.com",
        phone: "+234 803 123 4567",
        leaseStart: new Date("2024-01-01").toISOString(),
        leaseEnd: new Date("2025-01-01").toISOString(),
        rentAmount: 250000,
        rentFrequency: "monthly",
        paymentStatus: "paid",
        balance: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "tenant-2",
        unitId: "unit-2",
        propertyId: "prop-1",
        firstName: "Emeka",
        lastName: "Nwankwo",
        email: "emeka.nwankwo@email.com",
        phone: "+234 805 234 5678",
        leaseStart: new Date("2024-02-01").toISOString(),
        leaseEnd: new Date("2025-02-01").toISOString(),
        rentAmount: 350000,
        rentFrequency: "monthly",
        paymentStatus: "owing",
        balance: 175000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "tenant-3",
        unitId: "unit-4",
        propertyId: "prop-1",
        firstName: "Fatima",
        lastName: "Ibrahim",
        email: "fatima.ibrahim@email.com",
        phone: "+234 807 345 6789",
        leaseStart: new Date("2024-03-01").toISOString(),
        leaseEnd: new Date("2025-03-01").toISOString(),
        rentAmount: 350000,
        rentFrequency: "monthly",
        paymentStatus: "unpaid",
        balance: 700000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "tenant-4",
        unitId: "unit-5",
        propertyId: "prop-2",
        firstName: "Adesola",
        lastName: "Williams",
        email: "adesola.williams@email.com",
        phone: "+234 809 456 7890",
        leaseStart: new Date("2023-12-01").toISOString(),
        leaseEnd: new Date("2025-12-01").toISOString(),
        rentAmount: 800000,
        rentFrequency: "monthly",
        paymentStatus: "paid",
        balance: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "tenant-5",
        unitId: "unit-7",
        propertyId: "prop-2",
        firstName: "Oluwaseun",
        lastName: "Adebayo",
        email: "seun.adebayo@email.com",
        phone: "+234 810 567 8901",
        leaseStart: new Date("2024-04-01").toISOString(),
        leaseEnd: new Date("2025-04-01").toISOString(),
        rentAmount: 1200000,
        rentFrequency: "monthly",
        paymentStatus: "owing",
        balance: 400000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "tenant-6",
        unitId: "unit-8",
        propertyId: "prop-3",
        firstName: "TechCorp",
        lastName: "Solutions Ltd",
        email: "admin@techcorp.com",
        phone: "+234 812 678 9012",
        leaseStart: new Date("2024-01-01").toISOString(),
        leaseEnd: new Date("2026-01-01").toISOString(),
        rentAmount: 450000,
        rentFrequency: "monthly",
        paymentStatus: "paid",
        balance: 0,
        createdAt: new Date().toISOString(),
      },
    ];

    // Sample Payments
    const payments: Payment[] = [
      {
        id: "pay-1",
        tenantId: "tenant-1",
        unitId: "unit-1",
        propertyId: "prop-1",
        amount: 250000,
        date: new Date("2025-07-15").toISOString(),
        method: "bank_transfer",
        status: "completed",
        receiptNumber: "RCP-2025071501",
        createdAt: new Date().toISOString(),
      },
      {
        id: "pay-2",
        tenantId: "tenant-2",
        unitId: "unit-2",
        propertyId: "prop-1",
        amount: 175000,
        date: new Date("2025-07-10").toISOString(),
        method: "card",
        status: "completed",
        receiptNumber: "RCP-2025071002",
        createdAt: new Date().toISOString(),
      },
      {
        id: "pay-3",
        tenantId: "tenant-4",
        unitId: "unit-5",
        propertyId: "prop-2",
        amount: 800000,
        date: new Date("2025-07-20").toISOString(),
        method: "bank_transfer",
        status: "completed",
        receiptNumber: "RCP-2025072003",
        createdAt: new Date().toISOString(),
      },
      {
        id: "pay-4",
        tenantId: "tenant-6",
        unitId: "unit-8",
        propertyId: "prop-3",
        amount: 450000,
        date: new Date("2025-07-18").toISOString(),
        method: "bank_transfer",
        status: "completed",
        receiptNumber: "RCP-2025071804",
        createdAt: new Date().toISOString(),
      },
    ];

    // Sample Maintenance Requests
    const maintenanceRequests: MaintenanceRequest[] = [
      {
        id: "maint-1",
        tenantId: "tenant-2",
        unitId: "unit-2",
        propertyId: "prop-1",
        title: "Leaking Kitchen Faucet",
        description: "The kitchen faucet has been leaking for 3 days. Water is dripping constantly.",
        priority: "medium",
        status: "in_progress",
        createdAt: new Date("2025-07-16").toISOString(),
        updatedAt: new Date("2025-07-17").toISOString(),
      },
      {
        id: "maint-2",
        tenantId: "tenant-3",
        unitId: "unit-4",
        propertyId: "prop-1",
        title: "AC Not Working",
        description: "Air conditioning unit not cooling. Temperature is very high.",
        priority: "high",
        status: "pending",
        createdAt: new Date("2025-07-19").toISOString(),
        updatedAt: new Date("2025-07-19").toISOString(),
      },
      {
        id: "maint-3",
        tenantId: "tenant-5",
        unitId: "unit-7",
        propertyId: "prop-2",
        title: "Gate Remote Not Working",
        description: "The gate remote control needs battery replacement or repair.",
        priority: "low",
        status: "completed",
        createdAt: new Date("2025-07-12").toISOString(),
        updatedAt: new Date("2025-07-14").toISOString(),
      },
    ];

    // Sample Expenses
    const expenses: Expense[] = [
      {
        id: "exp-1",
        propertyId: "prop-1",
        category: "repairs",
        amount: 35000,
        description: "Plumbing repairs for Unit A101",
        date: new Date("2025-07-05").toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "exp-2",
        propertyId: "prop-1",
        category: "utilities",
        amount: 75000,
        description: "Monthly electricity bill",
        date: new Date("2025-07-01").toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "exp-3",
        propertyId: "prop-2",
        category: "taxes",
        amount: 200000,
        description: "Annual property tax",
        date: new Date("2025-06-30").toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "exp-4",
        propertyId: "prop-3",
        category: "insurance",
        amount: 150000,
        description: "Property insurance renewal",
        date: new Date("2025-07-10").toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    // Add all data to IndexedDB
    for (const property of properties) {
      await add("properties", property);
    }
    for (const unit of units) {
      await add("units", unit);
    }
    for (const tenant of tenants) {
      await add("tenants", tenant);
    }
    for (const payment of payments) {
      await add("payments", payment);
    }
    for (const request of maintenanceRequests) {
      await add("maintenance", request);
    }
    for (const expense of expenses) {
      await add("expenses", expense);
    }

    console.log("✅ Demo data seeded successfully!");
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}
