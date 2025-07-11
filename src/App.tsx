import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MonitoringPage from "./pages/MonitoringPage";
import Monitor from "./pages/Monitor";
import { Suspense } from "react";
import HttpRequestTemplate from "./pages/HttpRequestTemplate";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import EmailGroup from "./pages/EmailGroup/EmailGroup";
import Incidents from "./pages/Incidents";
import GoogleRedirectHandler from "./pages/GoogleRedirectHandler";
import OpenRoute from "./components/auth/OpenRoute";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFoundPage from "./pages/NotFoundPage";

ModuleRegistry.registerModules([AllCommunityModule]);



function App() {
  return (
    <Suspense fallback={<div>Error</div>}>      
      <Routes>
        <Route path="/" element={<OpenRoute><Login /></OpenRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route index element={<Navigate to={"monitors"} />}></Route>
          <Route path="monitors" element={<PrivateRoute><MonitoringPage /></PrivateRoute>}></Route>
          <Route path="monitors/:id" element={<PrivateRoute><Monitor /></PrivateRoute>} />
          <Route path="monitors/newHttp" element={<PrivateRoute><HttpRequestTemplate type="new" /></PrivateRoute>} />
          <Route path="monitors/editHttp/:id" element={<PrivateRoute><HttpRequestTemplate type="edit" /></PrivateRoute>} />
          <Route path="monitors/:id" element={<PrivateRoute><Monitor /></PrivateRoute>} />
          <Route path="incidents" element={<PrivateRoute><Incidents /></PrivateRoute>}></Route>
          <Route path="groups" element={<PrivateRoute><EmailGroup /></PrivateRoute>}></Route>
        </Route>
        <Route path="/loginwithgoogle" element={<GoogleRedirectHandler />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </Suspense>
  );
}

export default App;
