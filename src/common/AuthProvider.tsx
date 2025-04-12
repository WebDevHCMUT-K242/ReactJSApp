import React, { useEffect, useState } from "react";
import { AuthContext, AuthState, UserCore, UserMeta } from "./AuthContext.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(new AuthState(null, null, true));

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const core = new UserCore(data.user_id, data.username, data.is_admin);
        const meta = new UserMeta(data.display_name);
        setAuthState(new AuthState(core, meta, false));
      } else {
        setAuthState(new AuthState(null, null, false));
      }
    } catch {
      setAuthState(new AuthState(null, null, false));
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.success && data.user) {
        const user = data.user;
        const core = new UserCore(user.id, user.username, user.is_admin);
        const meta = new UserMeta(user.display_name);
        setAuthState(new AuthState(core, meta, false));
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuthState(new AuthState(null, null, false));
  };

  const refreshUserMeta = async () => {
    try {
      const res = await fetch("/api/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const meta = new UserMeta(data.display_name);
        setAuthState(prevState => new AuthState(prevState.userCore, meta, false));
      }
    } catch {
      setAuthState(prevState => new AuthState(prevState.userCore, null, false));
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, refreshUser, login, logout, refreshUserMeta }}>
      {children}
    </AuthContext.Provider>
  );
};