import React from "react";
import { Outlet } from "react-router-dom";
import DashLayoutFooter from "./DashLayoutFooter";
import DashLayoutHeader from "./DashLayoutHeader";

export default function DashLayout() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <DashLayoutHeader />
        <h1>Dash</h1>
        <Outlet />
      </div>
      <DashLayoutFooter />
    </>
  );
}
