
import { useAuth } from "../common/AuthContext.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import "./Login.css";

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
      <div className="login-page">
        <div className="icon">
        <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-12 w-12 text-blue-500"
  viewBox="0 0 16 16"
  fill="currentColor"
>
  <path d="M5 0a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v2h1v6H1v2a1 1 0 0 0 1 1h2v1a1 1 0 0 0 1 1h2v-1h2v1h2a1 1 0 0 0 1-1v-1h2a1 1 0 0 0 1-1v-2h-1V5h1V3a1 1 0 0 0-1-1h-2V1a1 1 0 0 0-1-1h-2v1H7V0H5zm1 1h4v2H6V1zm6 3v2H4V4h8zM4 7h8v2H4V7zm8 3v2H4v-2h8z"/>
</svg>
        </div>
      <div className="login-container">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary w-100 mb-2">
            Login
          </button>
        </form>
        <button
          className="btn btn-link text-light p-0 mb-1"
          onClick={() => setError("")}
        >
          Clear error
        </button>
        <br />
        <button className="btn btn-link text-light p-0" onClick={logout}>
          Log out
        </button>
      </div>
      </div>
  );
}

export default Login;
