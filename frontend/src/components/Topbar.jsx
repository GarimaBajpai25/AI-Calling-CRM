import {
  Search,
  Bell,
  Menu
} from "lucide-react";

function Topbar({ setIsOpen }) {
  return (
    <header className="topbar">

      <button
        className="mobile-menu"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={23} />
      </button>

      <div className="search-box">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search candidates, clients, calls..."
        />
      </div>

      <div className="topbar-right">

        <button className="notification">
          <Bell size={20} />
          <span></span>
        </button>

        <div className="top-profile">
          <div className="top-avatar">
            GB
          </div>

          <div className="top-user">
            <strong>Garima Bajpai</strong>
            <small>Admin</small>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Topbar;