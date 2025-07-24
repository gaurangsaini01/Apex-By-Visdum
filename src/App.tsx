import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard";
import MonitoringPage from "./pages/MonitoringPage";
import Monitor from "./pages/Monitor";
import { Suspense } from "react";
import HttpRequestTemplate from "./pages/HttpRequestTemplate";
import EmailGroup from "./pages/EmailGroup/EmailGroup";
import Incidents from "./pages/Incidents";
import GoogleRedirectHandler from "./pages/GoogleRedirectHandler";
import OpenRoute from "./components/auth/OpenRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Logs from "./pages/Logs";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { USER_ROLES } from "./utils/auth";
import UserManager from "./pages/UserManager";

function App() {
  return (
    <Suspense fallback={<div>Error</div>}>
      <Routes>
        <Route path="/" element={<OpenRoute><Login /></OpenRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="monitors" element={<ProtectedRoute requiredRoles={[USER_ROLES.USER]}><MonitoringPage /></ProtectedRoute>}></Route>
          <Route path="monitors/:id" element={<ProtectedRoute requiredRoles={[USER_ROLES.USER]}><Monitor /></ProtectedRoute>} />
          <Route path="monitors/newHttp" element={<ProtectedRoute requiredRoles={[USER_ROLES.USER]}><HttpRequestTemplate type="new" /></ProtectedRoute>} />
          <Route path="monitors/editHttp/:id" element={<ProtectedRoute requiredRoles={[USER_ROLES.USER]}><HttpRequestTemplate type="edit" /></ProtectedRoute>} />
          <Route path="monitors/:id" element={<ProtectedRoute requiredRoles={[USER_ROLES.USER]}><Monitor /></ProtectedRoute>} />
          <Route path="incidents" element={<ProtectedRoute requiredRoles={[USER_ROLES.USER]}><Incidents /></ProtectedRoute>}></Route>
          <Route path="groups" element={<ProtectedRoute requiredRoles={[USER_ROLES.USER]}><EmailGroup /></ProtectedRoute>}></Route>
          <Route path="logs" element={<ProtectedRoute requiredRoles={[USER_ROLES.ADMIN,USER_ROLES.USER]} redirectTo="/dashboard/logs"><Logs /></ProtectedRoute>}></Route>
          <Route path="user-manager" element={<ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]} redirectTo="/dashboard/user-manager"><UserManager /></ProtectedRoute>}></Route>
        </Route>
        <Route path="/loginwithgoogle" element={<GoogleRedirectHandler />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </Suspense>
  );
}

export default App;
