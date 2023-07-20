import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import DashboardLayout from "./components/dashboardlayout/DashboardLayout";
import store from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
