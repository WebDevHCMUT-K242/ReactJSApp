import { useEffect, useState } from "react";
import "./QnAList.css";
import { Link } from "react-router-dom";

import {Thread, Post} from "../common/qa/Interfaces.ts";
import {User} from "../common/GeneralUserData.ts";

function QnAList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [users, setUsers] = useState<Record<string, User>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch threads when component mounts
  useEffect(() => {
    async function fetchThreads() {
      try {
        const response = await fetch("/api/qa/list_threads.php");
        const data: Post = await response.json();

        if (data.success) {
          setUsers(data.users);
          setThreads(data.threads);
        } else {
          setError("Failed to load threads");
        }
      } catch (err) {
        setError("Error fetching threads");
      } finally {
        setLoading(false);
      }
    }

    fetchThreads();
  }, []);

  return (
    <div className="p-4 space-y-4 bg-blue-900 text-white h-100">
      <h1 className="text-2xl font-bold">Questions & answers</h1>
      {loading ? (<div>Loading threads...</div>) : error ? (
        <div>Couldn't fetch threads; encountered error.</div>
      ) : (
        threads.length === 0 ? (
          <div>No threads yet. Maybe you'll be the first to make one?</div>
        ) : (
          <ul className="space-y-3">
            {threads.map((thread) => (
              <li
                key={thread.id}
                className="p-4 bg-blue-800 rounded-lg shadow-md hover:bg-blue-700"
              >
                <div className="flex justify-between">
                  <div className="text-lg font-semibold">{thread.title}</div>
                  <span className={`text-sm ${thread.is_locked ? "text-red-500" : "text-green-500"}`}>
                    <Link
                      to={`/qa/${thread.id}`}
                      className="text-sm text-green-400 underline hover:text-green-300"
                    >
                      Open
                    </Link>
                  </span>
                </div>
                <p className="text-sm text-gray-300">{thread.message}</p>
                <div className="mt-2 text-xs text-gray-400">
                  <span>Posted by {users[thread.user_id].display_name || "unknown user"}</span> |
                  <span> Last updated: {new Date(thread.last_updated).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default QnAList;
