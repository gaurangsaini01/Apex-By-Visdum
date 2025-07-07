import { useNavigate, type NavigateFunction } from "react-router";
import { Card, Button } from "react-bootstrap";
import type { Monitor, Response } from "../../pages/MonitoringPage";
import { useSelector } from "react-redux";
import { deleteMonitor } from "../../services/operations/monitor";
import { FaRegCheckCircle, FaBolt, FaRegClock } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import "./MonitorCard.css"
import ConfirmationModal from "../Reusable/ConfirmationModal";
import { useState } from "react";

function MonitorCard({
  current_status,
  monitor,
  setMonitors,
}: {
  current_status: string;
  monitor: Monitor;
  setMonitors: React.Dispatch<React.SetStateAction<Response[]>>;
}) {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false)
  const { token } = useSelector((state: any) => state.auth);

  const handleEdit = () => {
    navigate(`/dashboard/monitors/editHttp/${monitor.id}`);
  };

  const handleDelete = async (monitorId: number, token: string, navigate: NavigateFunction) => {
    const res = await deleteMonitor(monitorId, token, navigate);
    if (res?.success) {
      setMonitors((prev) =>
        prev.filter((a: any) => a.monitor.id !== monitor.id)
      );
    }
  };
  console.log(monitor)
  return (
    <Card style={{ cursor: "pointer" }} className="shadow-sm border-0 mb-4 monitor-card rounded-4" >
      <Card.Body>
        <div onClick={() => navigate(`/dashboard/monitors/${monitor?.id}`)}>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h5 className="fw-semibold mb-1">{monitor.name[0].toLocaleUpperCase() + monitor.name.substring(1,) || "Monitor"}</h5>
              <a
                href={monitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-underline text-muted small"
              >
                {monitor.url.length > 37 ? `${monitor.url.substring(0, 35)}` + '...' : monitor.url}
              </a>
            </div>

            <span
              className={`badge rounded-pill px-3 py-1 ${current_status === "UP"
                ? "bg-success-subtle text-success"
                : "bg-danger-subtle text-danger"
                }`}
            >
              {current_status || "Waiting"}
            </span>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3 text-muted small">
            <span className="d-flex align-items-center">
              {current_status === "UP" && <FaRegCheckCircle size={14} className="me-1 text-success" />}
              {current_status === "DOWN" && <MdOutlineCancel size={16} className="me-1 text-danger" />}
              <span className="fw-medium">Status:</span> {current_status || "Waiting"}
            </span>
            <span className="d-flex align-items-center">
              <FaRegClock size={14} className="me-1" />
              <span className="fw-medium">Uptime: </span> {monitor.uptime_percent ? monitor?.uptime_percent : 0}%
            </span>
            <span>
              <FaBolt className="me-1 text-warning" />
              <span className="fw-medium">Response:</span> {monitor.response_time ? monitor?.response_time : 0}ms
            </span>
          </div>
        </div>

        <hr />

        <div className="d-flex justify-content-between align-items-center text-muted small">
          <span>
            Last Checked: {monitor?.last_checked_at || "—"}
          </span>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setShow(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
      <ConfirmationModal show={show} closeText="Cancel" submitText="Delete" onSubmit={() => handleDelete(monitor.id, token, navigate)} onClose={() => setShow(false)} title="Delete Monitor?" desc={"Are you sure you want to delete this Monitor ?"} />
    </Card>
  );
}

export default MonitorCard;
