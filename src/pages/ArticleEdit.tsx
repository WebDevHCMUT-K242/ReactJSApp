// src/pages/ArticleEdit.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../common/AuthContext";

interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  timestamp: string;
  lastUpdate: string;
  users: string;
  image_path?: string;
}

interface ArticleFetchResponse {
  success: boolean;
  article?: Article;
  error?: string;
}

interface ArticleUpdateResponse {
  success: boolean;
  error?: string;
}

export default function ArticleEdit() {
  const { userCore, loading: authLoading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/articles/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: Number(id) }),
      });
      const data: ArticleFetchResponse = await res.json();
      if (data.success && data.article) {
        if (!authLoading && userCore && (userCore.user_id !== data.article.user_id && !userCore.is_admin)) {
          navigate(`/articles/${id}`);
          return;
        }
        setArticle(data.article);
        setTitle(data.article.title);
        setContent(data.article.content);
      } else {
        setError(data.error || "Failed to load article");
      }
    } catch (e) {
      console.error(e);
      setError("Error fetching article");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError(null);
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    try {
      const res = await fetch("/api/articles/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: Number(id),
          title: title.trim(),
          content: content.trim(),
        }),
      });
      const data: ArticleUpdateResponse = await res.json();
      if (data.success) {
        navigate(`/articles/${id}`);
      } else {
        setError(data.error || "Failed to update article");
      }
    } catch (e) {
      console.error(e);
      setError("Error updating article");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!article) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">Edit Article</h1>
      <p className="text-gray-500">
        by <span className="font-medium">{article.users}</span> on {new Date(article.timestamp).toLocaleDateString()}
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate(`/articles/${id}`)}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
