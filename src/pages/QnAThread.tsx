import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post, PostFetchResponse, Thread } from "../common/qa/Interfaces.ts";
import { User } from "../common/GeneralUserData.ts";
import "./QnAThread.css";
import {useAuth} from "../common/AuthContext.ts";

function QnAThread() {
  const { userCore, loading: userAuthLoading } = useAuth();

  const { threadId } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyMessage, setReplyMessage] = useState("");

  async function fetchThread(firstLoad = false) {
    if (firstLoad) {
      setLoading(true);
    }
    try {
      const response = await fetch('/api/qa/get_thread.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId }),
      });

      const data: PostFetchResponse = await response.json();

      if (data.success) {
        setThread(data.thread!);
        setPosts(data.posts!);
        setUsers(data.users!);
      } else {
        setError(data.error || 'Failed to load thread.');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching thread data.');
    } finally {
      if (firstLoad) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (threadId) {
      fetchThread(true);
    }
  }, [threadId]);

  if (error) {
    return (
      <div className="flex-1 py-4 bg-blue-900 text-white h-100">
        <div className="flex justify-between px-6">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 py-4 bg-blue-900 text-white h-100">
        <div className="flex justify-between px-6">
          Loading thread...
        </div>
      </div>
    );
  }

  const t = thread!;

  const handleReplySubmit = async () => {
    const reply = replyMessage.trim();
    if (reply.length === 0 || !threadId) return;

    try {
      setReplyMessage("");

      const response = await fetch("/api/qa/create_post.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: Number(threadId),
          message: reply,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error("Failed to submit reply:", data.error);
        setError(data.error || "Failed to submit reply.");
        return;
      }

      await fetchThread();
    } catch (err) {
      console.error("Error submitting reply:", err);
      setError("Error submitting reply.");
    }
  };

  const handleSetThreadLock = async (newLockStatus: boolean) => {
    try {
      const response = await fetch("/api/qa/set_thread_locked.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: Number(threadId),
          is_locked: newLockStatus,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error("Failed to set thread lock status:", data.error);
        setError(data.error || "Failed to set thread lock status.");
        return;
      }

      console.log("ok");

      await fetchThread();
    } catch (err) {
      console.error("Error setting thread lock status:", err);
      setError("Error setting thread lock status.");
    }
  };

  return (
    <div className="flex-1 py-4 space-y-2 bg-blue-900 text-white h-100">
      <h1 className="px-6 mb-4 text-3xl font-medium">{t.title}</h1>

      <ul className="qna-post-list flex flex-col px-0 bg-gray-600">
        {t.is_locked ? (
          <li className="px-6 py-2 bg-red-950 text-white text-sm font-medium">
            This thread is locked; no new replies can be made.
          </li>
        ) : ""}
        <li key={"op"} className="px-6 py-3 bg-indigo-950 text-white text-sm">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{users[t.user_id]!.display_name}</span> (OP) <span>at {new Date(t.timestamp).toLocaleString()}</span>
          </div>
          <div className="mt-1">{t.message}</div>
        </li>
        {posts.length === 0 ? (
          <li className="px-6 py-2 bg-blue-950 text-white text-sm font-medium">
            {t.is_locked ? "No replies." : "No replies yet. Maybe you'll make the first?"}
          </li>
        ) : posts.map((post) => (
          <li key={post.id} className="px-6 py-3 bg-slate-800 text-white text-sm">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{users[post.user_id]!.display_name}</span>{post.user_id === t.user_id ? " (OP)" : ""} <span>at {new Date(post.timestamp).toLocaleString()}</span>
            </div>
            <div className="mt-1">{post.message}</div>
          </li>
        ))}
      </ul>

      {(!t.is_locked || (!userAuthLoading && (userCore?.is_admin || false))) && (
        <div className="flex flex-col text-sm">
          <textarea
            className="px-6 py-2 bg-gray-900 text-white border-t-1 border-t-gray-800 border-b-1 border-b-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:z-10 relative"
            rows={3}
            placeholder="Write your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button
            onClick={handleReplySubmit}
            className="pl-6 pr-4 py-1 text-left bg-blue-700 text-white hover:bg-blue-600 disabled:bg-blue-950 disabled:text-gray-400 border-b-1 border-b-gray-800"
            disabled={replyMessage.trim().length === 0}
          >
            Reply
          </button>
        </div>
      )}

      {(!userAuthLoading && (userCore?.is_admin || false)) && (
        thread?.is_locked ? (
          <button
            onClick={() => handleSetThreadLock(false)}
            className="pl-6 pr-4 py-1 text-left text-sm bg-orange-700 text-white hover:bg-orange-600 disabled:bg-orange-950 disabled:text-gray-400 border-b-1 border-b-gray-800"
          >
            Admin: Unlock thread
          </button>
        ) : (
          <button
            onClick={() => handleSetThreadLock(true)}
            className="pl-6 pr-4 py-1 text-left text-sm bg-orange-700 text-white hover:bg-orange-600 disabled:bg-orange-950 disabled:text-gray-400 border-b-1 border-b-gray-800"
          >
            Admin: Lock thread
          </button>
        )
      )}

    </div>
  );
}

export default QnAThread;
