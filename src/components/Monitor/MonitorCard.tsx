import { useNavigate } from "react-router";
import { Card, Button } from "react-bootstrap";
import type { Monitor, Response } from "../../pages/MonitoringPage";
import { useSelector } from "react-redux";
import { deleteMonitor } from "../../services/operations/monitor";

function MonitorCard({current_status, monitor, setMonitors }: { current_status:string,monitor: Monitor, setMonitors: React.Dispatch<React.SetStateAction<Response[]>> }) {
  const navigate = useNavigate();
  const { token } = useSelector((state: any) => state.auth);
  const handleEdit = () => {
    navigate(`/dashboard/monitors/editHttp/${monitor.id}`);
  };
  const handleDelete = async () => {
    const res = await deleteMonitor(monitor.id, token, navigate);
    console.log(res)
    if (res && res?.success) {
      setMonitors((prev) => prev.filter((a: any) => a.monitor.id != monitor.id))
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1 fw-semibold text-primary" style={{ wordBreak: "break-word" }}>
              {monitor.url}
            </Card.Title>
            <Card.Subtitle className="text-muted small">
              ID: {monitor.id}
            </Card.Subtitle>
          </div>

          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <div className="text-muted small d-flex flex-wrap gap-3">
          <span><strong>Interval:</strong> {monitor.check_interval} min</span>
          <span><strong>Timeout:</strong> {monitor.timeout}s</span>
          <span><strong>Notification:</strong> {monitor.email_notify ? "Yes" : "No"}</span>
          <span><strong>Method:</strong> {monitor.http_method}</span>
          <span><strong>Status:</strong> {current_status??"Up"}</span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MonitorCard;
