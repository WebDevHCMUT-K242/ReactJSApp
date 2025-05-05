import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../common/AuthContext";

interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  users: string;
  timestamp: string; // ISO string
  lastUpdate: string
}

interface ArticleFetchResponse {
  success: boolean;
  articles?: Article[];
  pages?: number;
  error?: string;
}

export default function ArticleList() {
  const { userCore, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);
  const q = query.get("q") || "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(q);

  // New article state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    loadArticles();
  }, [page, q]);

  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/articles/list.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, q }),
      });
      const data: ArticleFetchResponse = await res.json();
      if (data.success && data.articles) {
        setArticles(data.articles);
        setMaxPage(data.pages || 1);
      } else {
        setError(data.error || "Failed to load articles");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  const goPage = (p: number) => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    params.set("page", String(p));
    navigate(`/articles?${params.toString()}`);
  };

  const onSearch = () => goPage(1);

  const handleCreateArticle = async () => {
    const title = newTitle.trim();
    const content = newContent.trim();
    if (!title || !content) return;
    try {
      const res = await fetch("/api/articles/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (data.success && data.article_id) {
        navigate(`/articles/${data.article_id}`);
      } else {
        console.error(data.error);
        alert(data.error || "Failed to create article");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating article");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch("/api/articles/delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        loadArticles();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting article");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/articles/edit/${id}`);
  };

  return (
    <div className=" bg-white size-full space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-semibold text-black">Articles</h1>
        <div className="flex w-full md:ml-8 md:max-w-md">
          <input
            type="text"
            className="flex-grow border text-black border-gray-300 rounded-l w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <button
            onClick={onSearch}
            className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 transition"
          >
            Search
          </button> */}
        </div>
      </div>

      {/* Create Article (auth only) */}
      <div className="w-full bg-white max-w-4xl mx-auto">
        {!authLoading && userCore && (
          <div className="space-y-4 p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-medium text-black">Create New Article</h2>
            <input
              type="text"
              className="w-full text-black border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              rows={3}
              className="w-full border text-black border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button
              onClick={handleCreateArticle}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={!newTitle.trim() || !newContent.trim()}
            >
              Create Article
            </button>
          </div>
        )}
      </div>

      <div className="w-full bg-white max-w-4xl mx-auto">
        {/* List / Loading / Error */}
        {loading ? (
          <div>Loading articles...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : articles.length === 0 ? (
          <div>No articles found.</div>
        ) : (
          <ul className="space-y-4">
            {articles.filter((a)=> a.title.includes(searchTerm.trim()) || a.content.includes(searchTerm.trim())).map((a) => (
              <li key={a.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <Link to={`/articles/${a.id}`} className="block hover:bg-gray-50 p-4 rounded flex-1">
                    <h2 className="text-2xl font-semibold text-blue-600 hover:underline">
                      {a.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      by <span className="font-medium">{a.users}</span> on{' '}
                      {new Date(a.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 line-clamp-2">{a.content}</p>
                  </Link>
                  {/* Edit/Delete for owner or admin */}
                  {!authLoading && userCore && (userCore.user_id == a.user_id || userCore.is_admin) && (
                    <div className="flex flex-col ml-4 space-y-2">
                      <button
                        onClick={() => handleEdit(a.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* Pagination */}
        <div className="flex items-center justify-center space-x-4 pt-6">
          <button
            onClick={() => goPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &lt; Prev
          </button>
          <span>
            Page <span className="font-medium">{page}</span> of{' '}
            <span className="font-medium">{maxPage}</span>
          </span>
          <button
            onClick={() => goPage(page + 1)}
            disabled={page >= maxPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next &gt;
          </button>
        </div>
            </div>
      </div>
  );
}
