import { useNavigate } from "react-router";
import { Card, Button } from "react-bootstrap";
import type { Monitor, Response } from "../../pages/MonitoringPage";
import { useSelector } from "react-redux";
import { deleteMonitor } from "../../services/operations/monitor";
import { FaCheckCircle, FaClock, FaBolt } from "react-icons/fa";
import "./MonitorCard.css"

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
  const { token } = useSelector((state: any) => state.auth);

  const handleEdit = () => {
    navigate(`/dashboard/monitors/editHttp/${monitor.id}`);
  };

  const handleDelete = async () => {
    const res = await deleteMonitor(monitor.id, token, navigate);
    if (res?.success) {
      setMonitors((prev) =>
        prev.filter((a: any) => a.monitor.id !== monitor.id)
      );
    }
  };

  return (
    <Card className="shadow-sm border-0 mb-4 monitor-card rounded-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="fw-semibold mb-1">{monitor.name || "Monitor"}</h5>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-muted small"
            >
              {monitor.url.length > 40 ? `${monitor.url.substring(0, 40)}` + '...' : monitor.url}
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
          <span>
            <FaCheckCircle className="me-1 text-success" />
            Status: {current_status || "Waiting"}
          </span>
          <span>
            <FaClock className="me-1" />
            Uptime: {monitor.uptime_percent || "—"}
          </span>
          <span>
            <FaBolt className="me-1 text-warning" />
            Response: {monitor.response_time || "—"}ms
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between align-items-center text-muted small">
          <span>
            Last Checked: {monitor.last_checked || "—"}
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
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MonitorCard;
