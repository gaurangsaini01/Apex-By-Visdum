import { useNavigate } from "react-router"
import type { Monitor } from "../../pages/MonitoringPage";
function MonitorCard({ monitor }: { monitor: Monitor }) {
  const navigate = useNavigate();
  function handleEdit() {
    navigate(`/dashboard/monitors/editHttp/${monitor.id}`)
  }
  return (
    <div>
      <div className="d-flex gap-2 justify-content-between w-100">
        <div>
          {monitor.url}
        </div>
        <button onClick={handleEdit}>Edit</button>
      </div>
    </div>
  )
}

export default MonitorCard