import { useNavigate, type NavigateFunction } from "react-router";
import { Card, Tooltip } from "react-bootstrap";
import type { Monitor, Response } from "../../pages/MonitoringPage";
import { deleteMonitor, toggleStatus } from "../../services/operations/monitor";
import { FaRegCheckCircle, FaBolt, FaRegClock } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import "./MonitorCard.css"
import ConfirmationModal from "../Reusable/ConfirmationModal";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { formatDate } from "../../utils/date";

function MonitorCard({
  monitor,
  setMonitors,
}: {
  monitor: Monitor;
  setMonitors: React.Dispatch<React.SetStateAction<Response[]>>;
}) {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false)
  const [deletingMonitor, setDeletingMonitor] = useState(false)
  const handleEdit = () => {
    navigate(`/dashboard/monitors/editHttp/${monitor.id}`);
  };

  const handleDelete = async (monitorId: number, navigate: NavigateFunction) => {
    setDeletingMonitor(true)
    const res = await deleteMonitor(monitorId, navigate);
    setDeletingMonitor(false)
    if (res?.success) {
      setMonitors((prev) =>
        prev.filter((a: any) => a.monitor.id !== monitor.id)
      );
    }
  };

  // const toggleMonitorStatus = async () => {
  //   const res = await toggleStatus(monitor.id);
  //   console.log(res)
  //   setMonitors((prev) => {
  //     return prev.map((m) => {
  //       if (m.monitor.id === monitor.id) return { ...m, monitor: { ...m.monitor, status: m.monitor.status == "active" ? "paused" : "active", } }
  //       else return m
  //     })
  //   })
  // }
    const toggleMonitorStatus = async () => {
    const res = await toggleStatus(monitor.id);
    console.log(monitor)
    console.log(res.data.monitor)
    if (res.success && res.data) {
      setMonitors(prev =>
        prev.map(m =>
          m.monitor.id === monitor.id ? { ...m, monitor: res.data.monitor } : m
        )
      );
    }
  };

  return (
    <Card style={{ cursor: "pointer" }} className=" border mb-4 monitor-card rounded-4">
      <Card.Body onClick={() => {
        navigate(`/dashboard/monitors/${monitor?.id}`)
      }}>
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h5 style={{ cursor: "pointer" }} className="fw-semibold mb-1">{monitor.name[0].toLocaleUpperCase() + monitor.name.substring(1,) || "Monitor"}</h5>
              <a
                href={monitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-underline text-muted small"
                onClick={(e) => e.stopPropagation()}
              >
                {monitor.url.length > 30 ? `${monitor.url.substring(0, 30)}` + '...' : monitor.url}
              </a>
            </div>
            <div className="d-flex align-items-center gap-2">
              {monitor.status === "active" &&
                <OverlayTrigger placement="top"
                  overlay={<Tooltip id="button-tooltip-2">Pause Monitoring</Tooltip>}>
                  {({ ref, ...triggerHandler }) => (
                    <div ref={ref} ><CiPause1 className="hover-icons" size={23} style={{ cursor: "pointer" }} {...triggerHandler} onClick={(e) => {
                      e.stopPropagation()
                      toggleMonitorStatus()
                    }} /></div>
                  )}
                </OverlayTrigger>}
              {monitor.status !== "active" &&
                <OverlayTrigger placement="top"
                  overlay={<Tooltip id="button-tooltip-2">Resume Monitoring</Tooltip>}>
                  {({ ref, ...triggerHandler }) => (
                    <div ref={ref}><CiPlay1 className="hover-icons" size={23} style={{ cursor: "pointer" }} {...triggerHandler} onClick={(e) => {
                      e.stopPropagation()
                      toggleMonitorStatus()
                    }} /></div>
                  )}
                </OverlayTrigger>}
              <span
                className={`badge rounded-pill px-3 py-1 ${monitor.current_status === "UP"
                  ? "bg-success-subtle text-success"
                  : "bg-danger-subtle text-danger"
                  }`}
              >
                {monitor.current_status || "Waiting"}
              </span>
            </div>
          </div>
          <div className="text-muted small p-2">
            <div className="d-flex justify-content-between mb-1">
              <span className="d-flex align-items-center">
                {monitor.current_status === "UP" && <FaRegCheckCircle size={14} className="me-1 text-success" />}
                {monitor.current_status === "DOWN" && <MdOutlineCancel size={16} className="me-1 text-danger" />}
                <span className="fw-medium me-1">Status:  </span>{monitor.current_status || "Waiting"}
              </span>
              <span className="d-flex align-items-center">
                <FaRegClock size={14} className="me-1" />
                <span className="fw-medium me-1">Uptime: </span> {monitor.uptime_percent || 0}%
              </span>
            </div>
            <div>
              <span className="d-flex align-items-center">
                <FaBolt size={14} className="me-1 text-warning" />
                <span className="fw-medium me-1">Response: </span>{monitor.response_time || 0}ms
              </span>
            </div>
          </div>

        </div>

        <hr />

        <div onClick={(e) => {
          e.stopPropagation();
        }} className="d-flex justify-content-between align-items-center text-muted small">
          <span className="fw-medium">
            Last Checked: <span className="fw-normal">{monitor?.last_checked_at ? formatDate(monitor.last_checked_at) : "—"}</span>
          </span>
          <div className="d-flex gap-2">
            <CiEdit
              size={27}
              className="text-muted icons hover-icons"
              onClick={handleEdit}
            >
            </CiEdit>
            <AiOutlineDelete
              size={25}
              onClick={() => setShow(true)}
              className="text-danger icons hover-icons"
            >
              Delete
            </AiOutlineDelete>
          </div>
        </div>
      </Card.Body>
      <ConfirmationModal show={show} closeText="Cancel" submitText="Delete" onSubmit={() => handleDelete(monitor.id, navigate)} onClose={() => setShow(false)} title="Delete Monitor?" desc={"Are you sure you want to delete this Monitor ?"} disableState={deletingMonitor} />
    </Card>
  );
}

export default MonitorCard;
