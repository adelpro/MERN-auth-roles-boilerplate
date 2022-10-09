import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ring } from "@uiball/loaders";
import { useSetRecoilState } from "recoil";
import { AccessToken } from "../../recoil/atom";
import useLocalStorage from "../../hooks/useLocalStorage";
import styles from "./Login.module.css";
import axios from "../../api/axios";
export default function Login() {
  const setAccessToken = useSetRecoilState(AccessToken);
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
    axios.post(process.env.REACT_APP_BASEURL + "/auth");
    fetch(process.env.REACT_APP_BASEURL + "/auth", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
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
          console.log(err);
          setError(err.statusText);
        }
        setIsloading(false);
        errorRef.current.focus();
      });
  };
  useEffect(() => usernameRef.current.focus(), []);
  useEffect(() => setError(null), [username, password]);
  return (
    <section>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form__container}>
        <div>
          <div className={styles.form__control__container}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={usernameRef}
            />
          </div>
          <div className={styles.form__control__container}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={usernameRef}
            />
          </div>
        </div>
        <div className={styles.form__control__container}>
          <input
            id="persist"
            type="checkbox"
            checked={persist}
            onChange={() => setPersist((current) => !current)}
          />
          <label htmlFor="persist">Trust this device</label>
        </div>
        <button className={styles.button} type="submit" disabled={isloading}>
          {!isloading ? (
            "Login"
          ) : (
            <div className={styles.loaders__container}>
              {<Ring color="white" />}
            </div>
          )}
        </button>
        <p ref={errorRef} aria-live="assertive">
          {error}
        </p>
      </form>
    </section>
  );
}
