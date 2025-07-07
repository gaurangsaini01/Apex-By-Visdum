import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";

function Dashboard() {
  return (
    <div
      className="d-flex"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <Sidebar />
      <div
        className="flex-grow-1"
        style={{
          backgroundColor: "#f4f7f9",
          overflowY: "auto",
          minWidth: 0,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
