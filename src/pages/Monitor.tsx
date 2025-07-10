import { useEffect, useState, useCallback } from "react"
import { getChartData, getMonitorDetails, toggleStatus } from "../services/operations/monitor"
import { useNavigate, useParams } from "react-router"
import type { Monitor } from "./MonitoringPage"
import { IoChevronBackOutline } from "react-icons/io5"
import { FiEdit2, FiExternalLink, FiPause, FiPlay } from "react-icons/fi"
import { Button, Card, Col, Container, Row } from "react-bootstrap"
import { BsDot } from "react-icons/bs"
import Loader from "../components/Loader/Loader"
import { showSuccess, showError } from "../utils/Toast"
import { convertTimeToIST, formatDate } from "../utils/date"

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// Chart configuration
const createChartOptions = (maxValue = 1000) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: (context: any) => `${context.dataset.label}: ${context.parsed.y} ms`
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: maxValue,
      ticks: {
        callback: (value: any) => `${value}ms`
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6
    }
  }
});

const initialChartData = {
  labels: [],
  datasets: [
    {
      label: 'Response Time(ms)',
      data: [],
      borderColor: 'rgba(0, 200, 132, 1)',
      backgroundColor: 'rgba(0, 200, 132, 0.2)',
      tension: 0.3,
      pointBackgroundColor: 'rgb(1, 156, 104)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    },
  ],
};

function Monitor() {
  const [chartData, setChartData] = useState(initialChartData);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [range, setRange] = useState<"hourly" | "weekly" | "daily">("weekly");
  const navigate = useNavigate();
  const [monitor, setMonitor] = useState<Monitor>({} as Monitor);
  const [twentyFour, setTwentyFour] = useState({} as any);
  const [lastSevenDays, setLastSevenDays] = useState({} as any);
  const [lastThirtyDays, setLastThirtyDays] = useState({} as any);

  //memoized chart options
  const chartOptions = useCallback(() => {
    const maxResponseTime = Math.max(...chartData.datasets[0].data, 100);
    return createChartOptions(maxResponseTime + 100);
  }, [chartData.datasets]);

  // Load monitor details
  const loadMonitorDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getMonitorDetails(Number(id));
      if (res?.monitor) {
        setMonitor(res.monitor);
        setTwentyFour(res.last_24_hours || {});
        setLastSevenDays(res.last_7_days || {});
        setLastThirtyDays(res.last_30_days || {});
      }
    } catch (err) {
      showError('Failed to load monitor details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load chart data
  const loadChartData = useCallback(async () => {
    if (!id) return;

    setChartLoading(true);

    try {
      const response = await getChartData(id, range);
      if (response?.labels && response?.data) {
        setChartData({
          labels: range === "hourly" ? response.labels.map((label: any) => convertTimeToIST(label)) : response.labels,
          datasets: [
            {
              ...initialChartData.datasets[0],
              data: response.data,
            },
          ],
        });
      }
    } catch (err) {
      console.error('Failed to load chart data:', err);
      showError('Failed to load chart data');
    } finally {
      setChartLoading(false);
    }
  }, [id, range]);

  // Handle range change
  const handleRangeChange = useCallback((newRange: "hourly" | "weekly" | "daily") => {
    setRange(newRange);
  }, []);

  // Toggle monitor status
  const toggleMonitorStatus = async () => {
    if (!monitor?.id) return;

    try {
      const res = await toggleStatus(Number(monitor.id));
      if (res?.success) {
        const newStatus = monitor.status === "active" ? "paused" : "active";
        setMonitor({ ...monitor, status: newStatus });
        showSuccess(newStatus === "paused" ? "Paused" : "Resumed");
      }
    } catch (err) {
      showError('Failed to toggle monitor status');
    }
  };

  // Navigation handlers
  const handleBack = () => navigate('/dashboard/monitors');
  const handleEdit = () => navigate(`/dashboard/monitors/editHttp/${id}`);

  // Load initial data
  useEffect(() => {
    loadMonitorDetails();
  }, [loadMonitorDetails]);

  // Load chart data when range changes
  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  // Status card component
  const StatusCard = ({ title, subtitle, value, note }: {
    title: string,
    subtitle?: string,
    value?: string,
    note?: string
  }) => (
    <Card className="bg-white text-dark rounded shadow-sm mb-3 border-0">
      <Card.Body>
        <Card.Title className="text-muted small mb-1 fw-semibold text-primary">
          {title}
        </Card.Title>
        {value && (
          <h5 className={`${monitor.current_status === "UP" ? "text-success" : "text-danger"} fw-bold`}>
            {value}
          </h5>
        )}
        {subtitle && <p className="mb-0 text-dark-emphasis">{subtitle}</p>}
        {note && <small className="text-muted">{note}</small>}
      </Card.Body>
    </Card>
  );

  // Percentage card component
  const PercentageCard = ({ title, percentage, incidents, downTime }: {
    title: string;
    percentage: string;
    incidents: string;
    downTime: string;
  }) => (
    <Col md className="border-end border-light-subtle text-center">
      <h6 className="text-primary fw-semibold">{title}</h6>
      <h5 className="text-success fw-bold">{percentage}</h5>
      <small className="text-muted">{incidents} incidents, </small>
      <small>{downTime} down</small>
    </Col>
  );

  // Range selector component
  const RangeSelector = () => (
    <div className="d-flex gap-2 mb-3">
      {(['hourly', 'daily', 'weekly'] as const).map((rangeOption) => (
        <Button
          key={rangeOption}
          variant={range === rangeOption ? "primary" : "outline-primary"}
          size="sm"
          onClick={() => handleRangeChange(rangeOption)}
        >
          {rangeOption.charAt(0).toUpperCase() + rangeOption.slice(1)}
        </Button>
      ))}
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-3 bg-light min-vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

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

      <div className="p-3 bg-white">
        <Container fluid className="p-3 rounded d-flex justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center mb-1">
              <BsDot size={40} style={{ color: monitor.status }} />
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0 fw-bold text-primary">{monitor.name}</h5>
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
              {monitor.status === "active" ? (
                <div className="d-flex align-items-center">
                  <FiPause className="me-1" />
                  Pause
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <FiPlay className="me-1" />
                  Resume
                </div>
              )}
            </Button>
            <Button variant="outline-primary" onClick={handleEdit} size="sm">
              <FiEdit2 className="me-1" />
              Edit
            </Button>
          </div>
        </Container>

        <Container fluid className="p-0 bg-white rounded mt-4">
          <Row className="mb-4 g-3">
            <Col md={4}>
              <StatusCard
                title="Current status"
                value={monitor.current_status}
                note={`${monitor?.current_status?.charAt(0).toUpperCase()}${monitor.current_status?.slice(1).toLowerCase()} since ${formatDate(monitor.since)}`}
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
                  <small className="text-muted">
                    {twentyFour.no_incidents} incidents, {twentyFour.incident_duration} down
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="bg-white text-dark rounded shadow-sm border-0 mt-3">
            <Card.Body>
              <Row className="text-center">
                <PercentageCard
                  title="Last 7 days"
                  percentage={lastSevenDays?.health}
                  incidents={lastSevenDays?.no_incidents}
                  downTime={lastSevenDays?.incident_duration}
                />
                <PercentageCard
                  title="Last 30 days"
                  percentage={lastThirtyDays?.health}
                  incidents={lastThirtyDays?.no_incidents}
                  downTime={lastThirtyDays?.incident_duration}
                />
              </Row>
            </Card.Body>
          </Card>
        </Container>

        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-primary mb-0">Response Time Chart</h3>
            <RangeSelector />
          </div>

          <Card className="bg-white border-0 shadow-sm">
            <Card.Body>
              <div style={{ height: "400px", position: "relative" }}>
                {chartLoading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading chart...</span>
                    </div>
                  </div>
                ) : (
                  <Line data={chartData} options={chartOptions()} />
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Monitor;