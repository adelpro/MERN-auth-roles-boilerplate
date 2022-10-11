import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshAccessToken from "./useRefreshAccessToken";
import { useRecoilValue } from "recoil";
import { AccessToken } from "../recoil/atom";

const useAxiosPrivate = () => {
  const accessToken = useRecoilValue(AccessToken);
  const getNewToken = useRefreshAccessToken();
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && accessToken) {
          console.log("requestIntercept", accessToken);
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        //TODO testing refresh error here !!!
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await getNewToken();
          console.log("responseIntercept", newAccessToken);
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, getNewToken]);

  return axiosPrivate;
};
export default useAxiosPrivate;
