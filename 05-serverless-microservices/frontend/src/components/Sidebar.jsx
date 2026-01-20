import { FileText, Archive, Lock, Trash2 } from "lucide-react";
import "../styles/sidebar.css";

export default function Sidebar({ collapsed, activeView, onChangeView }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div
        className={`sidebar-item ${activeView === "notes" ? "active" : ""}`}
        onClick={() => onChangeView("notes")}
      >
        <span className="sidebar-icon">
          <FileText size={20} />
        </span>
        {!collapsed && <span className="sidebar-text">Notes</span>}
      </div>

      <div
        className={`sidebar-item ${activeView === "archive" ? "active" : ""}`}
        onClick={() => onChangeView("archive")}
      >
        <span className="sidebar-icon">
          <Archive size={20} />
        </span>
        {!collapsed && <span className="sidebar-text">Archive</span>}
      </div>

      <div
        className={`sidebar-item ${activeView === "locked" ? "active" : ""}`}
        onClick={() => onChangeView("locked")}
      >
        <span className="sidebar-icon">
          <Lock size={20} />
        </span>
        {!collapsed && <span className="sidebar-text">Locked</span>}
      </div>

      <div
        className={`sidebar-item ${activeView === "trash" ? "active" : ""}`}
        onClick={() => onChangeView("trash")}
      >
        <span className="sidebar-icon">
          <Trash2 size={20} />
        </span>
        {!collapsed && <span className="sidebar-text">Trash</span>}
      </div>
    </aside>
  );
}