import { useState } from 'react';
// import './Sidebar.css'; // optional for custom transitions

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div id="sidebar" className={isOpen ? 'active' : ''}>
      <div className="sidebar-wrapper active lg:static">
        <div className="sidebar-header">
          <img src="/assets/images/logo/logo.png" alt="Logo" />
        </div>

        <div className="sidebar-menu">
          <ul className="menu">
            <li className="sidebar-title">Menu</li>

            <li className="sidebar-item active">
              <a href="/" className="sidebar-link">
                <i className="bi bi-grid-fill" />
                <span>Dashboard</span>
              </a>
            </li>

            <li className="sidebar-item">
              <a href="/forms" className="sidebar-link">
                <i className="bi bi-journal-text" />
                <span>Forms</span>
              </a>
            </li>

            <li className="sidebar-item">
              <a href="/tables" className="sidebar-link">
                <i className="bi bi-table" />
                <span>Tables</span>
              </a>
            </li>
          </ul>
        </div>

        <button className="sidebar-toggler btn x" onClick={toggleSidebar}>
          <i className="bi bi-x" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
