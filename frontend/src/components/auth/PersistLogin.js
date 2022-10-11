import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Outlet, useNavigate } from "react-router-dom";

import { AccessToken, Persist } from "../../recoil/atom";
import useRefreshAccessToken from "../../hooks/useRefreshAccessToken";
export default function PersistLogin() {
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const persist = useRecoilValue(Persist);
  const getNewToken = useRefreshAccessToken();
  const navigate = useNavigate();
  useEffect(
    () => async () => {
      if (!accessToken && persist) {
        const newAccessToken = await getNewToken();
        setAccessToken(newAccessToken);
        navigate("/");
      } else if (!accessToken) {
        navigate("/");
      }
    },
    [accessToken, getNewToken, navigate, persist, setAccessToken]
  );
  return <Outlet />;
}
