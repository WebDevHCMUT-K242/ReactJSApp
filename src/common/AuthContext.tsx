import React, { createContext, useContext, useEffect, useState } from "react";

export class UserCore {
  constructor(
    public readonly user_id: number,
    public readonly username: string,
    public readonly is_admin: boolean
  ) {}
}

export class UserMeta {
  constructor(
    public display_name: string,
    // TODO: more mutable fields here
  ) {}
}

export class AuthState {
  userCore: UserCore | null = null;
  userMeta: UserMeta | null = null;
  loading: boolean = true;

  constructor(
    userCore: UserCore | null,
    userMeta: UserMeta | null,
    loading: boolean = true
  ) {
    this.userCore = userCore;
    this.userMeta = userMeta;
    this.loading = loading;
  }
}

interface AuthContextType extends AuthState {
  refreshUser: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(new AuthState(null, null, true));

  const refreshUser = async () => {
    try {
      const res = await fetch('https://yourdomain.com/api/me', {
        credentials: 'include',
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
      const res = await fetch('https://yourdomain.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, refreshUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};