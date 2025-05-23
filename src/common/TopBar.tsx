import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext.ts";

import "./TopBar.css";

function TopBar() {
  const { userCore, userMeta, logout, loading, loading: userAuthLoading } = useAuth();
  const isAdmin = !userAuthLoading && (userCore?.is_admin || false);

  return (
    <div className="top-bar">
      <div className="top-bar-pages">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/qa">Q&A</Link>
        {isAdmin && (
          <Link to="/admincontact">Manage Contacts</Link>
        )}
          <Link to="/contact">Contact</Link>
        
        <Link to="/articles">Articles</Link>
        <Link to="/product/search">Products</Link>
        <Link to="/order">Orders</Link>
      </div>
      <div
        className="top-bar-user flex flex-wrap justify-evenly w-40"
      >
        {loading ? (
          <span className="text-white">Checking login…</span>
        ) : userCore ? (
          <>
            <span className="text-white">
              {userMeta?.display_name || userCore.username}
            </span>
            <button
              onClick={logout}
              className="text-[var(--default-fore)] font-medium"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;
