import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../recoil/atom";

export default function UsersList() {
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3500/users", {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          return fetch("http://localhost:3500/auth/refresh", {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
        }
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  }, [accessToken]);
  const refreshAccessToken = () => {
    console.log({ accessToken });
    fetch("http://localhost:3500/auth/refresh", {
      method: "GET",
      mode: "cors",
      //credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data || !data.length)
    return (
      <>
        <button onClick={refreshAccessToken}>refresh token</button>
        <div>No data to show</div>
      </>
    );
  // render data

  return (
    <>
      <h1>UsersList</h1>
      <button onClick={refreshAccessToken}>refresh token</button>
      <ul>
        {data.json().map((user) => {
          return (
            <li key={user.id}>
              {user.username} - [
              {user.roles.map((role) => (
                <span key={role}>" " + role + " "</span>
              ))}
              ]
            </li>
          );
        })}
      </ul>
      <p>user list data...</p>
    </>
  );
}
