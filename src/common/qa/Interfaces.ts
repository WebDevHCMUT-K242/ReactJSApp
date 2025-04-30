import {User} from "../GeneralUserData.ts";

export interface Thread {
  id: number;
  user_id: number;
  title: string;
  message: string;
  timestamp: string;
  last_updated: string;
  is_locked: boolean;
}

export interface Post {
  success: boolean;
  threads: Thread[];
  users: Record<number, User>;
}