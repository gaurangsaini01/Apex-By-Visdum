import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";

function Dashboard() {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <div
        style={{ width: "240px", background: "#001840" }}
        className="p-0"
      >
        <Sidebar />
      </div>
      <div
        className="flex-grow-1 "
        style={{
          backgroundColor: "#f4f7f9",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
