import React from "react";
import { Outlet } from "react-router-dom";
import DashLayoutFooter from "./DashLayoutFooter";
import DashLayoutHeader from "./DashLayoutHeader";
import { useRecoilValue } from "recoil";
import { AccessToken } from "../recoil/atom";
import useRefreshAccessToken from "../hooks/useRefreshAccessToken";
export default function DashLayout() {
  const getNewToken = useRefreshAccessToken();
  const accessToken = useRecoilValue(AccessToken);
  return (
    <>
      <DashLayoutHeader />
      <div>Dash</div>
      <p>accessToken: {accessToken}</p>
      <p>Current server: {process.env.REACT_APP_BASEURL}</p>
      <button onClick={getNewToken}>Refresh Token</button>
      <Outlet />
      <DashLayoutFooter />
    </>
  );
}
