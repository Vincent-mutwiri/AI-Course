import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/services/api";
import { getToken, setToken, removeToken } from "@/utils/token";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyStoredToken = async () => {
      const token = getToken();
      if (token) {
        try {
          const { user } = await authAPI.verifyToken();
          setUser(user);
        } catch (error) {
          removeToken();
        }
      }
      setIsLoading(false);
    };
    verifyStoredToken();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await authAPI.login(email, password);
    setUser(user);
    setToken(token);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { user, token } = await authAPI.signup(name, email, password);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
