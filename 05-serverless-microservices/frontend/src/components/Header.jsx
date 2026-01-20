import { useState } from "react";
import "../styles/header.css";
import { FiMenu, FiSettings } from "react-icons/fi";

export default function Header({ onToggleSidebar, userEmail, onLogout }) {
  const [openSettings, setOpenSettings] = useState(false);

  const email = userEmail || "";
  const initial = email.length > 0 ? email.charAt(0).toUpperCase() : "?";

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-btn" onClick={onToggleSidebar}>
          <FiMenu />
        </button>
      </div>

      <div className="header-center">
        <h1>SECURE Notes</h1>
      </div>

      <div className="header-right">
        <div className="settings-wrapper">
          <FiSettings
            className="settings-icon"
            onClick={() => setOpenSettings(!openSettings)}
          />
          {openSettings && (
            <div className="settings-menu">
              <button>Dark Mode</button>
              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>

        <div className="profile" title={email}>
          {initial}
        </div>
      </div>
    </header>
  );
}