import { createContext, useContext } from "react";

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

export interface AuthContextType extends AuthState {
  refreshUser: () => Promise<string | null>;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => Promise<string | null>;
  refreshUserMeta: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}