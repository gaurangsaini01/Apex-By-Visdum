import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import MonitoringPage from "./pages/MonitoringPage";
import Monitor from "./pages/Monitor";
import NewHttpRequestPage from "./pages/NewHttpRequestPage";
import EmailGroups from "./pages/EmailGroups";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Navigate to={"monitors"} />}></Route>
        <Route path="monitors" element={<MonitoringPage />}></Route>
        <Route path="monitors/:id" element={<Monitor />} />
        <Route path="monitors/newHttp" element={<NewHttpRequestPage />} />
        <Route path="incidents" element={<MonitoringPage />}></Route>
        <Route path="groups" element={<EmailGroups />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
