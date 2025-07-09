import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import MonitoringPage from "./pages/MonitoringPage";
import Monitor from "./pages/Monitor";
import { Suspense } from "react";
import HttpRequestTemplate from "./pages/HttpRequestTemplate";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import EmailGroup from "./pages/EmailGroup/EmailGroup";

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
import Incidents from "./pages/Incidents";

ModuleRegistry.registerModules([AllCommunityModule]);

// Register components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Uptime %',
      data: [70, 60, 99.9, 82, 99.7, 20, 30, 40],
      borderColor: 'rgba(0, 200, 132, 1)',
      backgroundColor: 'rgba(0, 200, 132, 0.2)',
      tension: 0.3,
    },
  ],
};

const options = {
  // responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    tooltip: { mode: 'index' as const },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
    },
  },
};

function UptimeLineChart() {
  return <Line data={data} options={options} />;
}



function App() {
  return (
    <Suspense fallback={<div>Error</div>}>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chart" element={<UptimeLineChart />} />
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to={"monitors"} />}></Route>
          <Route path="monitors" element={<MonitoringPage />}></Route>
          <Route path="monitors/:id" element={<Monitor />} />
          <Route path="monitors/newHttp" element={<HttpRequestTemplate type="new" />} />
          <Route path="monitors/editHttp/:id" element={<HttpRequestTemplate type="edit" />} />
          <Route path="monitors/:id" element={<Monitor />} />
          <Route path="incidents" element={<Incidents />}></Route>
          <Route path="groups" element={<EmailGroup />}></Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
