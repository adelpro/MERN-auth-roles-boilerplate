import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../recoil/atom";
import { Outlet, useNavigate } from "react-router-dom";
export default function PersistLogin() {
  const [accessToken] = useRecoilState(AccessToken);
  const navigate = useNavigate();
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken]);
  return <Outlet />;
}
