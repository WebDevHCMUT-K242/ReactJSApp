import CommonPageBody from "../common/CommonPageBody.tsx";
import { useAuth } from "../common/AuthContext.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Login.css";

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
      <div className="login-container">
        <div className="icon">
          <i className="bi bi-cpu" />
        </div>
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
