import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../common/AuthContext";


interface Article {
    id: number;
    title: string;
    content: string;
    user_id: number;
    timestamp: string; // ISO string
    lastUpdate: string;
    users: string;
}

interface Comment {
  id: number;
  user_id: number;
  user: string
  article_id:number;
  message: string;
  timestamp: string;
}

interface ArticleFetchResponse {
  success: boolean;
  article?: Article;
  comments?: Comment[];
  error?: string;
}

export default function ArticleDetail() {
  const { userCore, loading: authLoading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");

  const [newComment, setNewComment] = useState("");

  const fetchData = async (firstLoad = false) => {
    if (firstLoad) setLoading(true);
    try {
      const res = await fetch("/api/articles/get.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: Number(id) }),
      });
      const data: ArticleFetchResponse = await res.json();
      if (data.success && data.article && data.comments) {
        setArticle(data.article);

        setComments(data.comments);
      } else {
        setError(data.error || "Failed to load article");
      }
    } catch (e) {
      console.error(e);
      setError("Error fetching data");
    } finally {
      if (firstLoad) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData(true);
  }, [id]);

  const handleCommentSubmit = async () => {
    const msg = newComment.trim();
    if (!msg) return;
    try {
      setNewComment("");
      const res = await fetch("/api/articles/add_comment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: Number(id), message: msg }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to post comment");
      } else {
        await fetchData();  // reload comments
      }
    } catch (e) {
      console.error(e);
      setError("Error posting comment");
    }
  };
  const handleDeleteArticle = async () => {
    if (!window.confirm("Delete this article?")) return;
    try {
      const res = await fetch("/api/articles/delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: Number(id) }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/articles');
      } else {
        alert(data.error || "Failed to delete article");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditArticle = () => {
    navigate(`/articles/edit/${id}`);
  };
  const handleDeleteComment = async (cid: number) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch("/api/articles/delete_comment.php", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: cid }),
      });
      const data = await res.json();
      if (data.success) setComments(cs => cs.filter(c => c.id !== cid));
      else alert(data.error || 'Failed to delete');
    } catch {
      console.error('Error deleting');
    }
  };

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditMessage(c.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditMessage("");
  };

  const handleUpdateComment = async (cid: number) => {
    const msg = editMessage.trim();
    if (!msg) return;
    try {
      const res = await fetch('/api/articles/update_comment.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: cid, message: msg }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(cs => cs.map(c => c.id === cid ? { ...c, message: msg } : c));
        cancelEdit();
      } else alert(data.error || 'Failed to update');
    } catch {
      console.error('Error updating');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)   return <div className="p-6 text-red-500">{error}</div>;
  if (!article) return null;

  return (
    <div className="size-full bg-white">
      <div className="mx-auto p-6 space-y-6 flex flex-col lg:flex-row">
        <div className="size-full max-w-3xl mx-auto">
          {/* Article Header */}
          <h1 className="text-4xl font-bold text-black">{article.title}</h1>
          <p className="text-black">
            by <span className="font-medium">{article.users}</span> on{" "}
            {new Date(article.timestamp).toLocaleDateString()}
          </p>
          {!authLoading && userCore && (userCore.user_id === article.user_id || userCore.is_admin) && (
            <div className="flex space-x-4">
              <button onClick={handleEditArticle} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit Article</button>
              <button onClick={handleDeleteArticle} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete Article</button>
            </div>
          )}
          {/* Article Content */}
          <div
            className="prose prose-lg text-black  mt-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
        <div className="size-full max-w-3xl mx-auto lg:max-w-lg">
          {/* Comments Section */}
          <div className="space-y-4 text-black">
            <h2 className="text-2xl font-semibold">Comments ({comments.length})</h2>
            {comments.length === 0 && (
              <p className="text-gray-600">Be the first to comment!</p>
            )}
            <ul className="space-y-4">
              {comments.map(c => (
                <li key={c.id} className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{c.user}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(c.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {userCore && (userCore.user_id === c.user_id || userCore.is_admin) && (
                      <div className="space-x-2">
                        {!editingId || editingId !== c.id ? (
                          <>
                            <button onClick={() => startEdit(c)} className="text-blue-600 hover:underline text-sm">Edit</button>
                            <button onClick={() => handleDeleteComment(c.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleUpdateComment(c.id)} className="text-green-600 hover:underline text-sm">Save</button>
                            <button onClick={cancelEdit} className="text-gray-600 hover:underline text-sm">Cancel</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {editingId === c.id ? (
                    <textarea
                      value={editMessage}
                      onChange={e => setEditMessage(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 mt-2 text-black"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2">{c.message}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* New Comment Form */}
          {!authLoading && userCore ? (
            <div className="space-y-2 mt-4">
              <textarea
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 text-black focus:ring-blue-500"
                rows={4}
                placeholder="Write your comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Post Comment
              </button>
            </div>
          ) : (
            <p className="text-gray-600">
              Please <a href="/login" className="text-blue-600 underline">login</a> to comment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}