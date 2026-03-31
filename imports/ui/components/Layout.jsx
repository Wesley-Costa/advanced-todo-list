import React from "react";
import { Outlet } from "react-router-dom";
import { SideMenu } from "../components/SideMenu";

export function Layout() {
  return (
    <>
      <SideMenu />
      <Outlet />
    </>
  );
}