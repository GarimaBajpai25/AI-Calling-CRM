import {
  LayoutDashboard,
  Users,
  Building2,
  UserRound,
  Phone,
  Megaphone,
  CalendarCheck,
  CheckSquare,
  Brain,
  BarChart3,
  UserCog,
  CreditCard,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";


const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Candidates",
    icon: Users,
    path: "/candidates",
  },
  {
    name: "Clients",
    icon: Building2,
    path: "/clients",
  },
  {
    name: "Leads",
    icon: UserRound,
    path: "/leads",
  },
  {
    name: "Calls",
    icon: Phone,
    path: "/calls",
  },
  {
    name: "Campaigns",
    icon: Megaphone,
    path: "/campaigns",
  },
  {
    name: "Follow-ups",
    icon: CalendarCheck,
    path: "/follow-ups",
  },
  {
    name: "Tasks",
    icon: CheckSquare,
    path: "/tasks",
  },
  {
    name: "AI Insights",
    icon: Brain,
    path: "/ai-insights",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    name: "Team",
    icon: UserCog,
    path: "/team",
  },
  {
    name: "Subscription",
    icon: CreditCard,
    path: "/subscription",
  },
];


function Sidebar({ isOpen, setIsOpen }) {

  const navigate = useNavigate();


  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("company");

    navigate("/login");

  };


  // Mobile menu close
  const handleNavigation = () => {

    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }

  };


  return (

    <aside
      className={`sidebar ${
        isOpen ? "sidebar-open" : ""
      }`}
    >

      {/* Header */}

      <div className="sidebar-header">

        <div className="logo">

          <div className="logo-icon">
            AI
          </div>

          <div>

            <h2>CallAI</h2>

            <span>
              Recruitment CRM
            </span>

          </div>

        </div>


        <button
          className="mobile-close"
          onClick={() => setIsOpen(false)}
        >

          <X size={22} />

        </button>

      </div>


      {/* Workspace */}

      <div className="workspace">

        <span>
          WORKSPACE
        </span>

      </div>


      {/* Main Menu */}

      <nav className="sidebar-menu">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `menu-item ${
                  isActive ? "active" : ""
                }`
              }
            >

              <Icon size={19} />

              <span>
                {item.name}
              </span>

            </NavLink>

          );

        })}

      </nav>


      {/* Bottom */}

      <div className="sidebar-bottom">


        {/* Settings */}

        <NavLink
          to="/settings"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `menu-item ${
              isActive ? "active" : ""
            }`
          }
        >

          <Settings size={19} />

          <span>
            Settings
          </span>

        </NavLink>


        {/* Logout */}

        <button
          className="menu-item logout"
          onClick={handleLogout}
        >

          <LogOut size={19} />

          <span>
            Logout
          </span>

        </button>


        {/* User */}

        <div className="user-box">

          <div className="user-avatar">
            GB
          </div>

          <div>

            <strong>
              Garima Bajpai
            </strong>

            <small>
              Administrator
            </small>

          </div>

        </div>

      </div>

    </aside>
  );
}


export default Sidebar;