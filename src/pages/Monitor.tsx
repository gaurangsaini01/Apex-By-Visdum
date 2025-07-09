import { useEffect, useState } from "react"
import { getMonitorDetails, toggleStatus } from "../services/operations/monitor"
import { useNavigate, useParams } from "react-router"
import type { Monitor } from "./MonitoringPage"
import { IoChevronBackOutline } from "react-icons/io5"
import { FiEdit2, FiExternalLink, FiPause, FiPlay } from "react-icons/fi"
import { Button, Card, Col, Container, Row } from "react-bootstrap"
import { BsDot } from "react-icons/bs"
import Loader from "../components/Loader/Loader"
import { showSuccess } from "../utils/Toast"
import { formatDate } from "../utils/date"

function Monitor() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [monitor, setMonitor] = useState<Monitor>({} as Monitor)
  const [twentyFour, setTwentyFour] = useState({} as any)
  const [lastSevenDays, setLastSevenDays] = useState({} as any)
  const [lastThirtyDays, setLastThirtyDays] = useState({} as any)


  const StatusCard = ({ title, subtitle, value, note }: {
    title: string,
    subtitle?: string,
    value?: string,
    note?: string
  }) => {
    console.log(value)
    return < Card className="bg-white text-dark rounded shadow-sm mb-3 border-0" >
      <Card.Body>
        <Card.Title className="text-muted small mb-1 fw-semibold text-primary">{title}</Card.Title>
        {value && <h5 className={`${monitor.current_status === "UP" ? "text-success" : "text-danger "} fw-bold`}>{value}</h5>}
        {subtitle && <p className="mb-0 text-dark-emphasis">{subtitle}</p>}
        {note && <small className="text-muted">{note}</small>}
      </Card.Body>
    </Card >
  };

  const PercentageCard = ({ title, percentage, incidents, downTime }: {
    title: string;
    percentage: string;
    incidents: string;
    downTime: string
  }) => (
    <Col md className="border-end border-light-subtle text-center">
      <h6 className="text-primary fw-semibold">{title}</h6>
      <h5 className="text-success fw-bold">{percentage}</h5>
      <small className="text-muted">{incidents} incidents, </small>
      <small>{`${downTime} down`}</small>
    </Col>
  );


  function handleBack() {
    navigate('/dashboard/monitors')
  }
  function handleEdit() {
    navigate(`/dashboard/monitors/editHttp/${id}`)
  }

  const toggleMonitorStatus = async () => {
    const res = await toggleStatus(Number(monitor?.id));
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
      const res = await getMonitorDetails(Number(id));
      console.log(res)
      setMonitor(res?.monitor)
      setTwentyFour(res?.last_24_hours)
      setLastSevenDays(res?.last_7_days)
      setLastThirtyDays(res?.last_30_days)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="p-3 bg-light min-vh-100">
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
            className="p-3 rounded d-flex justify-content-between align-items-center bg-white border border-light shadow-sm"
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
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

            <div className="d-flex gap-2">
              <Button variant="outline-success" size="sm" onClick={toggleMonitorStatus}>
                {monitor.status === "active" && <div className="d-flex align-items-center">
                  <FiPause className="me-1" />
                  Pause
                </div>
                }
                {monitor.status === "paused" && <div className="d-flex align-items-center">
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

          <Container fluid className="p-4 bg-white rounded shadow-sm mt-4">
            <Row className="mb-4 g-3">
              <Col md={4}>
                <StatusCard
                  title="Current status"
                  value={monitor.current_status}
                  note={`Currently up since ${formatDate(monitor.since)}`}
                />
              </Col>
              <Col md={4}>
                <StatusCard
                  title="Last check"
                  value={formatDate(monitor.last_checked_at!)}
                  note={`Checked every ${monitor.check_interval} minutes`}
                />
              </Col>
              <Col md={4}>
                <Card className="bg-white text-dark rounded shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="text-muted small mb-1">Last 24 hours</Card.Title>
                    <h5 className="text-success fw-bold">{twentyFour.health}</h5>
                    {/* <div>{twentyFourPerc.}</div> */}
                    <small className="text-muted">{twentyFour.no_incidents} incidents, {twentyFour.incident_duration
                    } down</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="bg-white text-dark rounded shadow-sm border-0 mt-3">
              <Card.Body>
                <Row className="text-center">
                  <PercentageCard title="Last 7 days" percentage={lastSevenDays?.health} incidents={lastSevenDays?.no_incidents} downTime={lastSevenDays?.incident_duration} />
                  <PercentageCard title="Last 30 days" percentage={lastThirtyDays?.health} incidents={lastThirtyDays?.no_incidents} downTime={lastThirtyDays?.incident_duration} />
                </Row>
              </Card.Body>
            </Card>
          </Container>
        </div>
      }
    </div>
  )
}

export default Monitor
