import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getAll, getById, initDB } from "@/lib/db";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback demo users for when database is empty or corrupted
const DEMO_USERS = [
  {
    id: "demo-admin",
    email: "admin@agently.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    phone: "+234-807-234-5678",
    role: "admin" as const,
    kycStatus: "verified" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-owner",
    email: "owner@agently.com",
    password: "owner123",
    firstName: "John",
    lastName: "Landlord",
    phone: "+234-801-234-5678",
    role: "owner" as const,
    kycStatus: "verified" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-manager",
    email: "manager@agently.com",
    password: "manager123",
    firstName: "Sarah",
    lastName: "Manager",
    phone: "+234-802-234-5678",
    role: "manager" as const,
    kycStatus: "verified" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-accountant",
    email: "accountant@agently.com",
    password: "accountant123",
    firstName: "Michael",
    lastName: "Finance",
    phone: "+234-803-234-5678",
    role: "accountant" as const,
    kycStatus: "verified" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-tenant",
    email: "tenant@agently.com",
    password: "tenant123",
    firstName: "Alice",
    lastName: "Tenant",
    phone: "+234-804-234-5678",
    role: "tenant" as const,
    kycStatus: "verified" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-realtor",
    email: "realtor@agently.com",
    password: "realtor123",
    firstName: "David",
    lastName: "Agent",
    phone: "+234-805-234-5678",
    role: "realtor" as const,
    kycStatus: "verified" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-contractor",
    email: "contractor@agently.com",
    password: "contractor123",
    firstName: "James",
    lastName: "Handyman",
    phone: "+234-806-234-5678",
    role: "contractor" as const,
    kycStatus: "verified" as const,
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    console.log("🔐 Checking existing authentication...");
    const userId = localStorage.getItem("currentUserId");
    console.log("👤 Stored userId:", userId);

    if (userId) {
      try {
        // Try to get user from database first
        const userData = await getById<User>("users", userId);
        if (userData) {
          console.log("✅ User authenticated from database:", userData.email);
          setUser(userData);
        } else {
          // Fallback: check if it's a demo user
          const demoUser = DEMO_USERS.find(u => u.id === userId);
          if (demoUser) {
            console.log("✅ Demo user authenticated from fallback:", demoUser.email);
            setUser(demoUser);
          } else {
            console.log("⚠️ Stored userId not found, clearing storage");
            localStorage.removeItem("currentUserId");
          }
        }
      } catch (error) {
        console.error("❌ Auth check failed, trying demo users:", error);
        // Fallback to demo users if database fails
        const demoUser = DEMO_USERS.find(u => u.id === userId);
        if (demoUser) {
          console.log("✅ Demo user authenticated after DB error:", demoUser.email);
          setUser(demoUser);
        } else {
          localStorage.removeItem("currentUserId");
        }
      }
    } else {
      console.log("ℹ️ No stored userId found");
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      console.log("🔑 Attempting login for:", email);

      // First try to get users from database
      let users: User[] = [];
      try {
        await initDB();
        users = await getAll<User>("users");
        console.log(`✅ Found ${users.length} users in database`);
      } catch (error) {
        console.warn("⚠️ Database unavailable, using demo users only:", error);
      }

      // Check database users first
      let foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      // If not found in database, check demo users
      if (!foundUser) {
        foundUser = DEMO_USERS.find(
          (u) => u.email === email && u.password === password
        );
        if (foundUser) {
          console.log("✅ Demo user found, login successful:", foundUser.email);
        }
      } else {
        console.log("✅ Database user found, login successful:", foundUser.email);
      }

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("currentUserId", foundUser.id);
        return true;
      } else {
        console.log("❌ Login failed - no matching user found");
        console.log("🔍 Available users:");
        [...users, ...DEMO_USERS].forEach(u => console.log(`   - ${u.email} (${u.role})`));
        return false;
      }
    } catch (error) {
      console.error("❌ Login error:", error);

      // Final fallback: try demo users even if everything fails
      const fallbackUser = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (fallbackUser) {
        console.log("✅ Fallback demo user login successful:", fallbackUser.email);
        setUser(fallbackUser);
        localStorage.setItem("currentUserId", fallbackUser.id);
        return true;
      }

      return false;
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("currentUserId");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
