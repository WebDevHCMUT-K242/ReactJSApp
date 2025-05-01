import { User } from "../GeneralUserData.ts";

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
  id: number;
  thread_id: number;
  user_id: number;
  message: string;
  timestamp: string;
}

export interface ThreadFetchResponse {
  success: boolean | undefined;
  threads: Thread[] | undefined;
  users: Record<number, User> | undefined;
  pages: number | undefined;
  error: string | undefined;
}

export interface PostFetchResponse {
  success: boolean;
  thread: Thread | undefined;
  posts: Post[] | undefined;
  users: Record<number, User> | undefined;
  error: string | undefined;
}