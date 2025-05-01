import { useAuth } from "../common/AuthContext.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorString = await login(username, password);
    if (errorString == null) {
      navigate("/");
    } else {
      setError(errorString);
    }
  };

  return (
    <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-blue-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M5 0a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v2h1v6H1v2a1 1 0 0 0 1 1h2v1a1 1 0 0 0 1 1h2v-1h2v1h2a1 1 0 0 0 1-1v-1h2a1 1 0 0 0 1-1v-2h-1V5h1V3a1 1 0 0 0-1-1h-2V1a1 1 0 0 0-1-1h-2v1H7V0H5zm1 1h4v2H6V1zm6 3v2H4V4h8zM4 7h8v2H4V7zm8 3v2H4v-2h8z"/>
          </svg>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-80">
          <h2 className="text-xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1 text-sm text-gray-300">Username</label>
              <input
                id="username"
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm text-gray-300">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-4 space-y-2 text-sm text-center">
            <button
              className="text-gray-400 hover:underline"
              onClick={() => setError("")}
            >
              Clear error
            </button>
            <br />
            <button
              className="text-gray-400 hover:underline"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
