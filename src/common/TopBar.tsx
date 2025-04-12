import {Link} from "react-router-dom";

import './TopBar.css'

function TopBar() {
  return (
    <div className={"top-bar"}>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </div>
  )
}

export default TopBar;