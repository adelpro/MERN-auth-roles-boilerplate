import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { AccessToken } from "../recoil/atom";
import { axiosPrivate } from "../api/axios";
import styles from "../App.module.css";
import dashstyles from "./DashLayoutHeader.module.css";
import { Ring } from "@uiball/loaders";
export default function DashLayoutHeader() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [isloading, setIsloading] = useState(false);
  const logoutHandler = async () => {
    setIsloading(true);
    axiosPrivate
      .post("/auth/logout")
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
      <div className={dashstyles.dash__header__container}>
        <h1>MERN - auth - roles</h1>
        {accessToken && (
          <>
            <button
              className={styles.button}
              onClick={logoutHandler}
              disabled={isloading}
            >
              {!isloading ? (
                "Logout"
              ) : (
                <div className={styles.loaders__container}>
                  {<Ring size={18} color="white" />}
                </div>
              )}
            </button>
          </>
        )}
      </div>
    </>
  );
}
