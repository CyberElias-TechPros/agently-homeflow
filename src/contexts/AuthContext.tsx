import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "@/lib/api";
import { User, getAll, getById, initDB } from "@/lib/db";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  register?: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: User[] = [
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

function mapApiUserToLocal(apiUser: any): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    password: "", // Don't store password
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    phone: apiUser.phone || "",
    role: apiUser.role,
    kycStatus: apiUser.kycStatus || "verified",
    avatar: apiUser.avatar,
    createdAt: apiUser.createdAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = apiClient.getToken();
      const storedUser = localStorage.getItem("agently_user");
      const userId = localStorage.getItem("currentUserId");

      if (token) {
        try {
          // Try API first
          const response = await apiClient.getMe();
          if (response.success) {
            const mapped = mapApiUserToLocal(response.data);
            setUser(mapped);
            setIsLoading(false);
            return;
          }
        } catch (error: any) {
          if (error.message === 'API_UNAVAILABLE') {
            console.warn("API unavailable, falling back to local storage");
          } else {
            console.warn("API auth failed, trying fallback:", error.message);
            // Token invalid, clear it
            if (error.message.includes('Unauthorized') || error.message.includes('Invalid token')) {
              apiClient.logout();
            }
          }
        }
      }

      // Fallback to local storage / IndexedDB
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(mapApiUserToLocal(parsed));
          setIsLoading(false);
          return;
        } catch {}
      }

      if (userId) {
        try {
          await initDB();
          const userData = await getById<User>("users", userId);
          if (userData) {
            setUser(userData);
            setIsLoading(false);
            return;
          }
        } catch {}

        const demoUser = DEMO_USERS.find(u => u.id === userId);
        if (demoUser) {
          setUser(demoUser);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      // Try API login first
      try {
        const response = await apiClient.login(email, password);
        if (response.success) {
          const mapped = mapApiUserToLocal(response.data.user);
          setUser(mapped);
          return true;
        }
      } catch (error: any) {
        if (error.message !== 'API_UNAVAILABLE') {
          console.warn("API login failed, trying local fallback:", error.message);
        }
        // If API unavailable, try local fallback
      }

      // Fallback to IndexedDB / demo users
      try {
        await initDB();
        const users = await getAll<User>("users");
        let foundUser = users.find(u => u.email === email && u.password === password);
        if (!foundUser) {
          foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
        }
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem("currentUserId", foundUser.id);
          localStorage.setItem("agently_user", JSON.stringify(foundUser));
          return true;
        }
      } catch (dbError) {
        console.warn("DB login failed, trying demo users only:", dbError);
        const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
        if (demoUser) {
          setUser(demoUser);
          localStorage.setItem("currentUserId", demoUser.id);
          localStorage.setItem("agently_user", JSON.stringify(demoUser));
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  async function register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string; role?: string }): Promise<boolean> {
    try {
      const response = await apiClient.register(data);
      if (response.success) {
        const mapped = mapApiUserToLocal(response.data.user);
        setUser(mapped);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  }

  function logout() {
    apiClient.logout();
    setUser(null);
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("agently_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, register }}>
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

export { DEMO_USERS };
