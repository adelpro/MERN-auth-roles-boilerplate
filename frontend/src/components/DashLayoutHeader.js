import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { AccessToken } from "../recoil/atom";
import { MdLogout, MdHome } from "react-icons/md";
import axios from "../api/axios";
import styles from "../App.module.css";
import dashstyles from "./DashLayoutHeader.module.css";
import { Ring } from "@uiball/loaders";
export default function DashLayoutHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAccessToken = useSetRecoilState(AccessToken);
  const [isloading, setIsloading] = useState(false);
  const logoutHandler = async () => {
    setIsloading(true);
    await axios
      .post("/auth/logout")
      .then(() => {
        setAccessToken(null);
        setIsloading(false);
        navigate("/");
      })
      .catch((err) => {
        setIsloading(false);
        console.log(err);
      });
  };
  return (
    <>
      <div className={dashstyles.dash__header__container}>
        MERN - auth - roles
        <div>
          <button
            className={styles.button}
            onClick={() => {
              navigate(location.state?.from?.pathname || "/dash", {
                replace: true,
              });
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MdHome size={30} style={{ marginRight: 10 }} />
              Home
            </div>
          </button>
          <button
            className={styles.button}
            onClick={logoutHandler}
            disabled={isloading}
          >
            {!isloading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MdLogout size={30} style={{ marginRight: 10 }} />
                Logout
              </div>
            ) : (
              <div className={styles.loaders__container}>
                {<Ring size={18} color="white" />}
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
