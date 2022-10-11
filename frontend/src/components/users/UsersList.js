import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useLocalStorage from "../../hooks/useLocalStorage";
import { AccessToken } from "../../recoil/atom";
export default function UsersList() {
  const axiosPrivate = useAxiosPrivate();
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [persist] = useLocalStorage("persist", false);
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const messageRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setIsloading(true);
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const result = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        setData(result?.data);
        setError(null);
        setIsloading(false);
      } catch (err) {
        setData(null);
        setIsloading(false);
        setError(err?.response?.message);
      }
    };

    getUsers();
    return () => {
      controller?.abort();
    };
  }, [accessToken, persist, setAccessToken, axiosPrivate]);
  const handleDeleteUser = async (id) => {
    await fetch(`${process.env.REACT_APP_BASEURL}/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json ",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (res.status === 403 && persist) {
        }
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((item) => item._id !== id);
          });
        }
        return res.json();
      })
      .then((result) => {
        setMessage(result);
        messageRef.current.focus();
      })
      .catch((err) => console.log({ err }));
  };
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
              <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              <button onClick={() => navigate(`/dash/users/${user._id}`)}>
                Update
              </button>
            </li>
          );
        })}
      </ul>

      <button onClick={() => navigate("/dash/users/signin")}>
        Add new user
      </button>
      <p ref={messageRef} aria-live="assertive">
        {message?.message}
      </p>
    </>
  );
}
