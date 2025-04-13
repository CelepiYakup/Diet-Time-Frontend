"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { User, userApi, LoginInput } from "../services/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (loginData: LoginInput) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (token: string): boolean => {
  try {

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);

    return exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error validating token:", error);

    return true;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const wasAuthenticated = useRef(false);
  const isRedirecting = useRef(false);
  const currentTokenStatus = useRef<{
    isValid: boolean;
    userId: number | null;
  }>({
    isValid: false,
    userId: null,
  });

  useEffect(() => {
    const validateToken = () => {
      const storedUser = localStorage.getItem("user");
      let shouldUpdateState = false;
      let updatedUser = null;
      let updatedAuthStatus = false;

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);

          if (userData && userData.token) {
            const tokenIsExpired = isTokenExpired(userData.token);

            const userId = userData.id;
            const previousStatus = currentTokenStatus.current;
            const statusChanged =
              previousStatus.isValid !== !tokenIsExpired ||
              previousStatus.userId !== userId;

            currentTokenStatus.current = {
              isValid: !tokenIsExpired,
              userId: userId,
            };

            if (tokenIsExpired) {

              if (isAuthenticated || statusChanged) {
                shouldUpdateState = true;
                updatedUser = null;
                updatedAuthStatus = false;

                if (wasAuthenticated.current && !isRedirecting.current) {
                  isRedirecting.current = true;

                  userData.tokenExpired = true;
                  localStorage.setItem("user", JSON.stringify(userData));

                  toast.error(
                    "Your session has expired. Please log in again.",
                    {
                      duration: 4000,
                      position: "top-center",
                      style: {
                        background: "#FF5252",
                        color: "#fff",
                        padding: "16px",
                        borderRadius: "8px",
                      },
                      iconTheme: {
                        primary: "#fff",
                        secondary: "#FF5252",
                      },
                    }
                  );

                  setTimeout(() => {
                    router.push("/login");
                    isRedirecting.current = false;
                  }, 1500);
                }
              }
            } else {

              if (!isAuthenticated || statusChanged) {
                shouldUpdateState = true;
                updatedUser = userData;
                updatedAuthStatus = true;


                if (userData.tokenExpired) {
                  delete userData.tokenExpired;
                  localStorage.setItem("user", JSON.stringify(userData));
                }
              }
            }
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          if (isAuthenticated) {
            shouldUpdateState = true;
            updatedUser = null;
            updatedAuthStatus = false;
          }
        }
      } else if (isAuthenticated) {
        shouldUpdateState = true;
        updatedUser = null;
        updatedAuthStatus = false;
      }

      if (shouldUpdateState) {
        setUser(updatedUser);
        setIsAuthenticated(updatedAuthStatus);
      }

      if (isLoading) {
        setIsLoading(false);
      }
    };

    wasAuthenticated.current = isAuthenticated;

    validateToken();

    const tokenCheckInterval = setInterval(validateToken, 10000);

    return () => clearInterval(tokenCheckInterval);
  }, [router, isAuthenticated, isLoading]);

  const login = async (loginData: LoginInput) => {
    try {
      setIsLoading(true);
      const response = await userApi.loginUser(loginData);
      const userData = response.user;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const getAuthToken = (): string | null => {
  try {
    const authData = localStorage.getItem("user");
    if (!authData) return null;

    const userData = JSON.parse(authData);

    if (userData.token) {
      if (isTokenExpired(userData.token)) {
        if (
          typeof window !== "undefined" &&
          window.location.pathname.includes("/dashboard")
        ) {
          return userData.token;
        }

        return null;
      }

      return userData.token;
    }

    return null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};
