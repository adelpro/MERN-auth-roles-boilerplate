import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { AccessToken } from "../recoil/atom";
import styles from "./DashLayoutHeader.module.css";
export default function DashLayoutHeader() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [isloading, setIsloading] = useState(false);
  const logoutHandler = () => {
    setIsloading(true);
    fetch(`${process.env.REACT_APP_BASEURL}/auth/logout`, {
      method: "POST",
      //credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${AccessToken}`,
      },
    })
      .then(() => {
        setAccessToken(null);
        setIsloading(false);
        navigate("/");
      })
      .catch(() => {
        setIsloading(false);
      });
  };
  return (
    <>
      <div className={styles.dash__header__container}>
        <h1>MERN auth - roles</h1>
        {accessToken && (
          <>
            <button disabled={isloading} onClick={logoutHandler}>
              {isloading ? "Loading..." : "Logout"}
            </button>
          </>
        )}
      </div>
    </>
  );
}
