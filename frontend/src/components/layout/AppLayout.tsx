import { Outlet } from "react-router-dom";

import { Navbar } from "./Navbar";
import "./layout.css";

export function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-layout__content">
        <Outlet />
      </div>
    </div>
  );
}