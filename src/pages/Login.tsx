import CommonPageBody from "../common/CommonPageBody.tsx";
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
    <CommonPageBody>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      <button onClick={() => setError("")}>Clear error</button>
      <button onClick={() => logout()}>Log out</button>
    </CommonPageBody>
  )
}

export default Login;
