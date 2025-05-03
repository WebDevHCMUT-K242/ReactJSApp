import { useEffect, useState } from "react";
import "./QnAList.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Thread, ThreadFetchResponse } from "../common/qa/Interfaces.ts";
import { User } from "../common/GeneralUserData.ts";
import {useAuth} from "../common/AuthContext.ts";

function QnAList() {
  const { userCore, loading: userAuthLoading } = useAuth();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(1);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page") || "1", 10);
  const navigate = useNavigate();

  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadMessage, setNewThreadMessage] = useState("");

  useEffect(() => {
    async function fetchThreads() {
      try {
        const response = await fetch("/api/qa/list_threads.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page }),
        });
        const data: ThreadFetchResponse = await response.json();

        if (data.success) {
          setUsers(data.users!);
          setThreads(data.threads!);
          setMaxPageNumber(data.pages!);
        } else {
          setError(data.error || "Failed to load threads");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching threads");
      } finally {
        setLoading(false);
      }
    }

    fetchThreads();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      navigate(`/qa?page=${newPage}`);
    }
  };

  const handleNewThreadSubmit = async () => {
    const title = newThreadTitle.trim();
    const message = newThreadMessage.trim();
    if (title.length === 0 || message.length === 0) return;

    try {
      setNewThreadTitle("");
      setNewThreadTitle("");

      const response = await fetch("/api/qa/create_thread.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error("Failed to submit reply:", data.error);
        setError(data.error || "Failed to submit reply.");
        return;
      }

      navigate(`/qa/${data.thread_id}`);
    } catch (err) {
      console.error("Error submitting reply:", err);
      setError("Error submitting reply.");
    }
  };

  return (
    <div className="flex-1 py-4 space-y-4 bg-blue-900 text-white h-100">
      <div className="flex justify-between px-6">
        <h1 className="pb-1 text-3xl font-medium">Questions & answers</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="text-white p-2 text-sm geom disabled:opacity-30"
          >
            &lt;
          </button>
          <span className={"items-end"}>
            <span className="text-lg text-white font-medium">{page}</span> <span className="text-sm text-gray-300">of {maxPageNumber} ({threads.length} thread{threads.length === 1 ? "" : "s"} shown)</span>
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= maxPageNumber}
            className="text-white p-2 text-sm geom disabled:opacity-30"
          >
            &gt;
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading threads...</div>
      ) : error ? (
        <div>Couldn't fetch threads; encountered error.</div>
      ) : (
        <ul className="flex flex-col px-0 qna-thread-list bg-gray-600">
          {(threads.length === 0 && !userAuthLoading) ? (
            <li className="px-6 py-2 bg-blue-950 text-white text-sm font-medium">
              {userCore === null ? "No threads." : "No threads yet. Maybe you'll make the first?"}
            </li>
          ) : (
            threads.map((thread) => (
              <li key={thread.id}>
                <Link
                  to={`/qa/${thread.id}`}
                  className="block px-6 py-3 bg-gray-800 text-white qna-thread"
                >
                  <div className="flex justify-between">
                    <div className="text-lg font-semibold flex-1">
                      {thread.title}
                      <span className="pl-1.5 text-xs text-gray-300 font-normal">
                    by <span className={"font-medium"}>{users[thread.user_id]!.display_name}</span> <span className={"text-gray-400"}>at {new Date(thread.timestamp).toLocaleString()}</span>
                  </span>
                    </div>

                    <span className="mt-1 text-xs text-gray-400">
                  Last updated {new Date(thread.last_updated).toLocaleString()}
                </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-1">{thread.message}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}

      {(!userAuthLoading && userCore !== null) && (
        <div className="flex flex-col text-sm">
          <input
            className="px-6 py-2 bg-gray-900 text-white border-t-1 border-t-gray-800 border-b-1 border-b-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:z-10 relative"
            placeholder="Write your title..."
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
          />
          <textarea
            className="px-6 py-2 bg-gray-900 text-white border-t-1 border-t-gray-800 border-b-1 border-b-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:z-10 relative"
            rows={3}
            placeholder="Write your message..."
            value={newThreadMessage}
            onChange={(e) => setNewThreadMessage(e.target.value)}
          />
          <button
            onClick={handleNewThreadSubmit}
            className="pl-6 pr-4 py-1 text-left bg-blue-700 text-white hover:bg-blue-600 disabled:bg-blue-950 disabled:text-gray-400 border-b-1 border-b-gray-800"
            disabled={newThreadTitle.trim().length === 0 || newThreadMessage.trim().length === 0}
          >
            Create new thread
          </button>
        </div>
      )}
    </div>
  );
}

export default QnAList;
