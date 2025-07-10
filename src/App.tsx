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
import Incidents from "./pages/Incidents";
import GoogleRedirectHandler from "./pages/GoogleRedirectHandler";

ModuleRegistry.registerModules([AllCommunityModule]);



function App() {
  return (
    <Suspense fallback={<div>Error</div>}>

      <Routes>
        <Route path="/" element={<Login />} />
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
        <Route path="/loginwithgoogle" element={<GoogleRedirectHandler />}></Route>
      </Routes>
    </Suspense>
  );
}

export default App;
