import { Button } from "react-bootstrap";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import ZeroState from "../images/monitor_zero_state.svg"
const MonitoringPage = () => {
  const navigate = useNavigate();
  const handleAddMonitor = () => {
    navigate('/dashboard/monitors/newHttp')
  }
  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Left: Heading */}
        <h3 className="text-dark mb-0 d-flex">
          <div>Monitors</div>
          <strong className="text-primary">.</strong>
        </h3>

        {/* Right: Button Group */}
        <div>
          <Button type="submit" onClick={handleAddMonitor} variant="primary" className="align-items-center"><IoAddOutline size={20} /><span>New Monitor</span></Button>
        </div>
      </div>
      <div className="monitor-zero-state">

        {/* This will be conditionally rendered if no monitors are created as of now. */}
        <div className="p-0 m-0 overflow-hidden w-100" style={{ height: '85vh', margin: 0 }}>
          <img
            src={ZeroState}
            alt=""
            className=" monitor-zero-state"
          />
        </div>

      </div>
    </div>
  );
};

export default MonitoringPage;
