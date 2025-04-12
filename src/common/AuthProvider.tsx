import React, { useEffect, useState } from "react";
import { AuthContext, AuthState, UserCore, UserMeta } from "./AuthContext.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(new AuthState(null, null, true));

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/user/me.php", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthState(new AuthState(null, null, false));
        return data.error || "Fetching user data failed; unknown error.";
      }

      if (data.success && data.user) {
        const user = data.user;
        const core = new UserCore(user.id, user.username, user.is_admin);
        const meta = new UserMeta(user.display_name);
        setAuthState(new AuthState(core, meta, false));
        return null;
      } else {
        setAuthState(new AuthState(null, null, false));
        return data.error || "Fetching user data failed; unknown error.";
      }
    } catch {
      setAuthState(new AuthState(null, null, false));
      return "Fetching user data failed due to a network error.";
    }
  };

  const login = async (username: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/user/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return data.error || "Login failed; unknown error.";
      }

      if (data.success && data.user) {
        const user = data.user;
        const core = new UserCore(user.id, user.username, user.is_admin);
        const meta = new UserMeta(user.display_name);
        setAuthState(new AuthState(core, meta, false));
        return null;
      }

      return data.error || "Unknown error.";
    } catch {
      return "Login failed due to a network error.";
    }
  };

  const logout = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/user/logout.php", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        return data.error || "Logout failed; unknown error.";
      }

      setAuthState(new AuthState(null, null, false));
      return null;
    } catch {
      return "Logout failed due to a network error.";
    }
  };

  const refreshUserMeta = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/user/me.php", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return data.error || "Failed to refresh user metadata.";
      }

      if (data.success && data.user) {
        const meta = new UserMeta(data.user.display_name);
        setAuthState((prevState) => new AuthState(prevState.userCore, meta, false));
        return null;
      }

      return data.error || "Failed to refresh user metadata.";
    } catch {
      return "Failed to refresh user metadata due to a network error.";
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