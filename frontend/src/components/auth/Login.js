import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../recoil/atom";
import useLocalStorage from "../../hooks/useLocalStorage";
export default function Login() {
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [persist, setPersist] = useLocalStorage("persist", false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const usernameRef = useRef();
  const errorRef = useRef();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsloading(true);
    setError(null);
    fetch(process.env.REACT_APP_BASEURL + "/auth", {
      method: "POST",
      mode: "cors",
      //credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (res.status !== 200) {
          setIsloading(false);
          throw res;
        }
        return res.json();
      })
      .then((result) => {
        setAccessToken(result.accessToken);
        setIsloading(false);
        setError(null);
        setUsername("");
        setPassword("");
        navigate("/dash");
      })
      .catch((err) => {
        if (!err.status) {
          setError("No server response");
        } else if (err.status === 400) {
          setError("Missing username or password");
        } else if (err.status === 401) {
          setError("Unauthorized");
        } else {
          setError(err);
        }
        setIsloading(false);
        errorRef.current.focus();
      });
  };
  useEffect(() => usernameRef.current.focus(), []);
  useEffect(() => setError(null), [username, password]);
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <p ref={errorRef} aria-live="assertive">
          {error}
        </p>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            ref={usernameRef}
          />
          <label htmlFor="password">Username</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={usernameRef}
          />
        </div>
        <div>
          <input
            id="persist"
            type="checkbox"
            checked={persist}
            onChange={() => setPersist((current) => !current)}
          />

          <label htmlFor="persist">Trust this device</label>
        </div>
        <button type="submit">LogIn</button>
      </form>
    </>
  );
}
