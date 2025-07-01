import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer/>
    </BrowserRouter>
  </Provider>
);
