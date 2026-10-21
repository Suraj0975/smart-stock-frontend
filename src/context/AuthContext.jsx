import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

import api from "../lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("smartstock_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);

    const token = data.token || data.accessToken;
    const loggedInUser = data.user || data.data?.user;

    if (!token || !loggedInUser) {
      throw new Error(
        "The login API must return a token and user."
      );
    }

    localStorage.setItem("smartstock_token", token);
    localStorage.setItem(
      "smartstock_user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);

    const token = data.token || data.accessToken;
    const registeredUser = data.user || data.data?.user;

    if (token && registeredUser) {
      localStorage.setItem("smartstock_token", token);
      localStorage.setItem(
        "smartstock_user",
        JSON.stringify(registeredUser)
      );

      setUser(registeredUser);
    }

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("smartstock_token");
    localStorage.removeItem("smartstock_user");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [user, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}