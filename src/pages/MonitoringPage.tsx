import { Button } from "react-bootstrap";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import ZeroState from "../images/monitor_zero_state.svg"
import { useEffect, useState } from "react";
import { getMonitors } from "../services/operations/monitor";
import Loader from "../components/Loader/Loader";
import MonitorCard from "../components/Monitor/MonitorCard";


export interface Monitor {
  name: string
  auth_token: string | null
  auth_type: string
  check_interval: number
  email_notify: number
  http_incidents_code: number[]
  http_method: string
  uptime_percent: string
  id: number
  last_checked_at: null
  request_body: string | null
  response_time: string
  request_header: string
  timeout: number
  status: "active" | "paused"
  url: string
}

export interface Response {
  current_status: string
  duration_in_seconds: number
  monitor: Monitor
  since: string
}

const MonitoringPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [monitors, setMonitors] = useState<Response[]>([])
  const handleAddMonitor = () => {
    navigate('/dashboard/monitors/newHttp')
  }
  useEffect(() => {
    (async function () {
      setLoading(true);
      const response = await getMonitors()
      setMonitors(response)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="p-3 container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-dark mb-0 d-flex">
          <div>Monitors</div>
          <strong className="text-primary">.</strong>
        </h3>
        <div>
          <Button type="submit" onClick={handleAddMonitor} variant="primary" className="align-items-center"><IoAddOutline size={20} /><span>New Monitor</span></Button>
        </div>

      </div>
      {
        loading ? (
          <Loader />
        ) : monitors?.length === 0 ? (
          <div className="monitor-zero-state">
            <div className="p-0 m-0 overflow-hidden w-100" style={{ height: '85vh' }}>
              <img src={ZeroState} alt="" className="monitor-zero-state" />
            </div>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-3" >{monitors?.map((monitor) => {
            return <MonitorCard key={monitor.monitor.id} current_status={monitor.current_status} monitor={monitor.monitor} setMonitors={setMonitors} />
          })}</div>
        )
      }
    </div>
  );
};

export default MonitoringPage;