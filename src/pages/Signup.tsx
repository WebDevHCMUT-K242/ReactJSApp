// src/pages/Signup.tsx
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng ký ở đây
    alert(`Username: ${username}\nDisplay Name: ${displayName}\nPassword: ${password}`);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="icon">
          <i className="bi bi-person-plus" />
        </div>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              className="form-control"
              placeholder="Enter display name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
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
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
