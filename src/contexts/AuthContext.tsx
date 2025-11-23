import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getProfile, clearToken as clearApiToken } from "../services/api";

interface User {
  id: string;
  email: string;
  role: string;
  profile?: Record<string, any>;
  verificationCredits?: number;
  auth?: {
    email: string;
  };
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user: userData } = await getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const logout = () => {
    clearApiToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
