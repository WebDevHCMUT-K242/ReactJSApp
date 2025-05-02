// src/pages/Signup.tsx
import { useState } from "react";
// import "./Signup.css";

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
      <div className="icon">
        <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 16 16"
  className="h-18 w-18 text-blue-500"
>
  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  <path d="M9 8a.5.5 0 0 1 .5.5V9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.5a.5.5 0 0 1 .5-.5h6zM13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
</svg>
        </div>
      <div className="signup-container">
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
