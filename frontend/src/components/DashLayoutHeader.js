import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { AccessToken } from "../recoil/atom";
export default function DashLayoutHeader() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const logoutHandler = () => {
    setIsloading(true);
    setError(null);
    fetch("http://localhost:3500/auth/logout", {
      method: "POST",
      mode: "cors",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setAccessToken(null);
        setIsloading(false);
        setError(null);
        navigate("/");
      })
      .catch((err) => {
        setError(err);
        setIsloading(false);
      });
  };
  return (
    <>
      {accessToken && (
        <>
          <button disabled={isloading} onClick={logoutHandler}>
            {isloading ? "..." : "Logout"}
          </button>
        </>
      )}
    </>
  );
}
