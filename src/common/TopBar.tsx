import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext.ts";

import "./TopBar.css";

function TopBar() {
  const { userCore, userMeta, loading } = useAuth();

  return (
    <div className={"top-bar"}>
      <div className={"top-bar-pages"}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div style = {{display: "flex", flexFlow: "row wrap", justifyContent: "space-evenly", width: "10rem"}} className={"top-bar-user"}>
        {loading ? (
          <span>Checking login…</span>
        ) : userCore ? (
          <span>{userMeta?.display_name || userCore.username}</span>
        ) : (
          <Link to="/login">Login</Link>
        )}
        {<Link to="/signup">Sign up</Link>}
      </div>
    </div>
  );
}

export default TopBar;
