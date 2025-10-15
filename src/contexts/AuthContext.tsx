import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getAll, getById, initDB } from "@/lib/db";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      try {
        const userData = await getById<User>("users", userId);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem("currentUserId");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("currentUserId");
      }
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      await initDB();
      const users = await getAll<User>("users");
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("currentUserId", foundUser.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
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
