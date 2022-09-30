import React from "react";
import { Outlet } from "react-router-dom";
import DashLayoutFooter from "./DashLayoutFooter";
import DashLayoutHeader from "./DashLayoutHeader";
import { useRecoilState, useRecoilValue } from "recoil";
import { AccessToken } from "../recoil/atom";

export default function DashLayout() {
  // const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const accessToken = useRecoilValue(AccessToken);
  return (
    <>
      <DashLayoutHeader />
      <div>Dash</div>
      <p>accessToken: {accessToken}</p>
      <Outlet />
      <DashLayoutFooter />
    </>
  );
}
