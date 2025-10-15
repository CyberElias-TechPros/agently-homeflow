// Simplified seed data for demo purposes
import { initDB, add, getAll, Property, Unit, Tenant, Payment, MaintenanceRequest, Expense, User } from "./db.ts";

export async function seedDemoData() {
  try {
    console.log("🌱 Starting simplified demo data seeding...");
    await initDB();
    console.log("✅ Database initialized for seeding");

    // Check if users already exist (simple check)
    const existingUsers = await getAll<User>("users");
    console.log(`👥 Checking existing users: ${existingUsers.length} found`);

    if (existingUsers.length > 0) {
      console.log("ℹ️ Users already exist, skipping seeding");
      return;
    }

    console.log("🚀 No users found, seeding demo data...");

    // Simplified user seeding - just the essentials
    const users: User[] = [
      {
        id: "demo-admin",
        email: "admin@agently.com",
        password: "admin123",
        firstName: "Admin",
        lastName: "User",
        phone: "+234-807-234-5678",
        role: "admin",
        kycStatus: "verified",
        createdAt: new Date().toISOString(),
      },
      {
        id: "demo-owner",
        email: "owner@agently.com",
        password: "owner123",
        firstName: "John",
        lastName: "Landlord",
        phone: "+234-801-234-5678",
        role: "owner",
        kycStatus: "verified",
        createdAt: new Date().toISOString(),
      },
      {
        id: "demo-manager",
        email: "manager@agently.com",
        password: "manager123",
        firstName: "Sarah",
        lastName: "Manager",
        phone: "+234-802-234-5678",
        role: "manager",
        kycStatus: "verified",
        createdAt: new Date().toISOString(),
      },
      {
        id: "demo-tenant",
        email: "tenant@agently.com",
        password: "tenant123",
        firstName: "Alice",
        lastName: "Tenant",
        phone: "+234-804-234-5678",
        role: "tenant",
        kycStatus: "verified",
        createdAt: new Date().toISOString(),
      },
    ];

    // Simple insertion without complex verification
    console.log(`📥 Inserting ${users.length} users...`);

    for (const user of users) {
      try {
        await add<User>("users", user);
        console.log(`  ✓ User inserted: ${user.firstName} ${user.lastName} (${user.email})`);
      } catch (error) {
        console.warn(`  ⚠️ Could not insert user ${user.email}:`, error.message);
        // Continue with other users even if one fails
      }
    }

    // Verify users were created (but don't fail if verification fails)
    try {
      const insertedUsers = await getAll<User>("users");
      console.log(`✅ Seeding completed: ${insertedUsers.length} users available`);
      if (insertedUsers.length > 0) {
        console.log("🎉 Demo users ready! You can now log in with:");
        insertedUsers.forEach(u => console.log(`   - ${u.email} / ${u.password}`));
      }
    } catch (error) {
      console.warn("⚠️ Could not verify users, but seeding may have worked:", error.message);
    }

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    // Don't throw - let the app continue even if seeding fails
  }
}

// Utility function to check if we have any users (for debugging)
export async function checkUsers() {
  try {
    const users = await getAll<User>("users");
    console.log(`🔍 Current users in database: ${users.length}`);
    users.forEach(u => console.log(`   - ${u.email} (${u.role})`));
    return users;
  } catch (error) {
    console.error("❌ Could not check users:", error);
    return [];
  }
}
