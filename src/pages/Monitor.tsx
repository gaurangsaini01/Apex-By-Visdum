import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getMonitorDetails, toggleStatus } from "../services/operations/monitor"
import { useNavigate, useParams } from "react-router"
import type { Monitor } from "./MonitoringPage"
import { IoChevronBackOutline } from "react-icons/io5"
import { FiEdit2, FiExternalLink, FiPause, FiPlay } from "react-icons/fi"
import { Button } from "react-bootstrap"
import { BsDot } from "react-icons/bs"
import Loader from "../components/Loader/Loader"
import { showSuccess } from "../utils/Toast"

function Monitor() {
  const { token } = useSelector((state: any) => state.auth)
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [monitor, setMonitor] = useState<Monitor>({})

  function handleBack() {
    navigate('/dashboard/monitors')
  }
  function handleEdit() {
    navigate(`/dashboard/monitors/editHttp/${id}`)
  }

  const toggleMonitorStatus = async () => {
    const res = await toggleStatus(Number(monitor?.id), token);
    if (res?.success) {
      if (monitor.status === "active") {
        showSuccess("Paused")
      }
      else {
        showSuccess("Resumed")
      }
      setMonitor({ ...monitor, status: monitor.status === "active" ? "paused" : "active" })
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await getMonitorDetails(Number(id), token);
      setMonitor(res?.monitor)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="p-3">
      <header className="sticky-top back-header px-3">
        <button
          onClick={handleBack}
          className="d-flex align-items-center gap-1 btn btn-primary"
        >
          <IoChevronBackOutline />
          Monitoring
        </button>
      </header>
      {
        loading ? <Loader /> : <div className="p-3">
          <div
            className="p-3 rounded d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "#f8f9fa", border: "1px solid #e0e0e0" }}
          >
            {/* Left Content */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                {/* Status Dot */}
                <BsDot style={{ color: "#28a745", fontSize: "2rem", marginTop: "-3px" }} />
                <h5 className="mb-0 fw-bold text-primary">{monitor.url}</h5>
                <a
                  href={monitor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-success"
                  style={{ fontSize: "0.9rem" }}
                >
                  <FiExternalLink />
                </a>
              </div>

              <small className="text-muted">
                HTTP/S monitor for{" "}
                <a
                  href={monitor.url}
                  className="text-success text-decoration-underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {monitor.url}
                </a>
              </small>
            </div>

            {/* Right Buttons */}
            <div className="d-flex gap-2">
              <Button variant="outline-success" size="sm" onClick={toggleMonitorStatus}>
                {monitor.status === "active" && <div>
                  <FiPause className="me-1" />
                  Pause
                </div>
                }
                {monitor.status === "paused" && <div>
                  <FiPlay className="me-1" />
                  Resume
                </div>
                }

              </Button>
              <Button variant="outline-primary" onClick={handleEdit} size="sm">
                <FiEdit2 className="me-1" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Monitor