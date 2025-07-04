import { NavLink, useNavigate } from "react-router-dom";
import { sideBarOptions } from "../../data";
import "./Sidebar.css";
import { logout } from "../../services/operations/auth";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../../utils/getInitial";

const Sidebar = () => {
  const { token, user } = useSelector((state: any) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await logout(token, navigate, dispatch)
  };




  return (
    <div className="sidebar-container d-flex flex-column justify-content-between p-3">
      <div>
        <h5 className="sidebar-logo mb-4">
          <span className="text-primary">●</span> Visdum Robot
        </h5>

        {sideBarOptions.map((option) => {
          const Icon = option.icon
          return <NavLink
            key={option.name}
            to={option.name}
            className={({ isActive }) =>
              `sidebar-link d-flex align-items-center gap-2 p-2 mb-2 ${isActive ? "active" : ""
              }`
            }
          >
            <Icon className="sidebar-icon" /><span>{option.value}</span>
          </NavLink>
        })}
      </div>

      <div className="sidebar-footer text-center mt-auto">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <div className="avatar-circle">{getInitials(user)}</div>
          <span className="text-dark fw-semibold">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline-primary w-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
