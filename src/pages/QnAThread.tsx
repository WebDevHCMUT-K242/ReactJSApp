import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post, PostFetchResponse, Thread } from "../common/qa/Interfaces.ts";
import { User } from "../common/GeneralUserData.ts";

function QnAThread() {
  const { threadId } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThread() {
      setLoading(true);
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
        setLoading(false);
      }
    }

    if (threadId) {
      fetchThread();
    }
  }, [threadId]);

  if (loading) {
    return <div>Loading thread...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const t = thread!;

  return (
    <div className="flex flex-1 flex-col thread-container">
      <h1 className="text-xl font-bold">{t.title} <span className={"text-sm text-gray-400 font-normal"}>by {users[t.user_id]!.display_name}</span></h1>
      <div className="thread-message mt-4">{t.message}</div>

      <div className="posts mt-6">
        {posts.length === 0 ? (
          <div>No posts yet. Be the first to comment!</div>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="post">
                <div className="post-meta text-sm text-gray-500">
                  <span>Posted by {users[post.user_id]?.display_name || 'Unknown User'}</span>
                  <span> | Posted at: {new Date(post.timestamp).toLocaleString()}</span>
                </div>
                <div className="post-message mt-2">{post.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default QnAThread;
