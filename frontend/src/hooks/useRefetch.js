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
        setAccessToken(result.accessToken);
      })
      .catch((err) => {
        console.log({ err });
        setRefreshTokenError(err);
      });
  };
  return { refreshTokenError, getNewToken };
};
export default useRefetch;
