import { useState } from "react";
import { useRecoilState } from "recoil";
import { AccessToken } from "../recoil/atom";
const useRefetch = () => {
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [refreshTokenError, setRefreshTokenError] = useState(null);
  const getNewToken = () => {
    console.log(accessToken);
    setRefreshTokenError(null);
    fetch(`${process.env.REACT_APP_BASEURL}/auth/refresh`, {
      method: "GET",
      mode: "cors",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json ",
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        console.log({ res });
        return res.json();
      })
      .then((result) => {
        console.log({ result });
        if (result.accessToken) {
          return setAccessToken(result.accessToken);
        }
        return null;
      })
      .catch((err) => {
        console.log({ err });
        setRefreshTokenError(err);
      });
  };
  return { refreshTokenError, getNewToken };
};
export default useRefetch;
