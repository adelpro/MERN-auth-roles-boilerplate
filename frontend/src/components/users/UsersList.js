import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useLocalStorage from "../../hooks/useLocalStorage";
import { AccessToken } from "../../recoil/atom";

export default function UsersList() {
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [persist] = useLocalStorage("persist", false);
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setIsloading(true);
    fetch(`${process.env.REACT_APP_BASEURL}/users`, {
      method: "GET",
      //credentials: "include",
      headers: {
        "Content-Type": "application/json ",
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.status === 403 && persist) {
          //Refresh token only on trusted devices
          fetch(`${process.env.REACT_APP_BASEURL}/auth/refresh`, {
            method: "GET",
            //credentials: "include",
            headers: {
              "Content-Type": "application/json ",
              authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => {
              if (res && res.status === 403) {
              }
              return res.json();
            })
            .then((result) => {
              setAccessToken(result.accessToken);
              setIsloading(false);
              setError(null);
            });
        }
        return res.json();
      })
      .then((result) => {
        setData(result);
        setError(null);
        setIsloading(false);
      })

      .catch((err) => {
        setData(null);
        setIsloading(false);
        setError(err);
      });
  }, [accessToken]);

  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data || !data.length)
    return (
      <>
        <div>No data to show</div>
      </>
    );
  // render data

  return (
    <>
      <h1>UsersList</h1>
      <ul>
        {data.map((user) => {
          return (
            <li key={user._id}>
              {user.username} - [
              {user.roles.map((role) => (
                <span key={role}>{role} ,</span>
              ))}
              ]
            </li>
          );
        })}
      </ul>

      <button onClick={() => navigate("/dash/users/signin")}>
        Add new user
      </button>
    </>
  );
}
