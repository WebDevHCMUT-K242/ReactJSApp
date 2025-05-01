import { useEffect, useState } from "react";
import "./QnAList.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Thread, Post } from "../common/qa/Interfaces.ts";
import { User } from "../common/GeneralUserData.ts";

function QnAList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [users, setUsers] = useState<Record<string, User>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page") || "1", 10);
  const navigate = useNavigate();

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
        const data: Post = await response.json();

        if (data.success) {
          setUsers(data.users);
          setThreads(data.threads);
        } else {
          setError("Failed to load threads");
        }
      } catch (err) {
        console.log(err);
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

  return (
    <div className="flex-1 py-4 space-y-4 bg-blue-900 text-white h-100">
      <div className="flex justify-between px-6">
        <h1 className="pb-1 text-2xl font-bold">Questions & answers</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="text-white text-2xl"
          >
            &lt;
          </button>
          <span className="text-lg text-white">{page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="text-white text-2xl"
          >
            &gt;
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading threads...</div>
      ) : error ? (
        <div>Couldn't fetch threads; encountered error.</div>
      ) : threads.length === 0 ? (
        <div>No threads yet. Maybe you'll be the first to make one?</div>
      ) : (
        <ul className="flex flex-col px-0 qna-thread-list bg-gray-600">
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                to={`/qa/${thread.id}`}
                className="block px-6 py-3 bg-gray-800 text-white qna-thread"
              >
                <div className="flex justify-between">
                  <div className="text-lg font-semibold">
                    {thread.title}{" "}
                    <span className="text-sm text-gray-400 font-normal">
                      by {users[thread.user_id]?.display_name || "unknown user"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 line-clamp-1">{thread.message}</p>
                <div className="mt-1 text-xs text-gray-400">
                  <span>
                    Last updated: {new Date(thread.last_updated).toLocaleString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QnAList;
