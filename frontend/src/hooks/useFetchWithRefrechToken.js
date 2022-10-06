import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { AccessToken } from "../recoil/atom";
import useLocalStorage from "./useLocalStorage";

const useFetchWithRefechToken = (urlParam, options) => {
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [persist] = useLocalStorage("persist", false);
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    setIsloading(true);
    console.log(`${process.env.REACT_APP_BASEURL}/${urlParam}`, options);
    fetch(`${process.env.REACT_APP_BASEURL}/${urlParam}`, options)
      .then((res) => {
        if (res.status === 403 && persist) {
          //Refresh token only on trusted devices
          fetch(`${process.env.REACT_APP_BASEURL}/auth/refresh`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json ",
              authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => {
              return res.json();
            })
            .then((result) => {
              console.log("Refresh fetch result:", result);
              setAccessToken(result.accessToken);
              setIsloading(false);
              setError(null);
            });
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
        setData(result);
        setError(null);
        setIsloading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setData(null);
        setIsloading(false);
        setError(err);
      });
    //estlint-disable-next-line no-use-before-define
  }, [accessToken, persist]);
  const deleteItem = (id) => {
    fetch(`${process.env.REACT_APP_BASEURL}/${urlParam}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json ",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((item) => item._id !== id);
          });
        }
        return res.json();
      })
      .then((result) => {
        setMessage(result);
      })
      .catch((err) => setMessage(err?.message));
  };
  return { isLoading, error, data, message, deleteItem };
};
export default useFetchWithRefechToken;
