import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/user/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          display_name: displayName,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(-1); // Go back to the previous page
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex-1 bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="h-16 w-16 text-blue-500"
          >
            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M9 8a.5.5 0 0 1 .5.5V9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.5a.5.5 0 0 1 .5-.5h6zM13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-1">
              Display Name
            </label>
            <input
              id="displayName"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter display name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
