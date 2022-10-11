import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Ring } from "@uiball/loaders";
import { useRecoilState, useSetRecoilState } from "recoil";
import { AccessToken, Persist } from "../../recoil/atom";
import { MdLogin } from "react-icons/md";
import styles from "../../App.module.css";
import axios from "../../api/axios";
export default function Login() {
  const setAccessToken = useSetRecoilState(AccessToken);
  const [persist, setPersist] = useRecoilState(Persist);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const usernameRef = useRef();
  const errorRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    setError(null);
    try {
      const result = await axios.post(
        "/auth",
        { username, password },
        { withCredentials: true }
      );
      setAccessToken(result?.data?.accessToken);
      setIsloading(false);
      setError(null);
      setUsername("");
      setPassword("");
      navigate(location.state?.from?.pathname || "/dash", { replace: true });
    } catch (err) {
      if (!err?.response?.status) {
        setError("No server response");
      } else if (err?.response?.status === 400) {
        setError("Missing username or password");
      } else if (err?.response?.status === 401) {
        setError("Unauthorized");
      } else {
        setError(err?.message);
      }
      setIsloading(false);
      errorRef.current.focus();
    }
  };
  useEffect(() => usernameRef.current.focus(), []);
  useEffect(() => setError(null), [username, password]);
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MdLogin size={30} style={{ marginRight: 10 }} />
        <h1>Login </h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.form__container}>
        <div>
          <div className={styles.form__control__container}>
            <label htmlFor="username" style={{ width: "100px" }}>
              Username
            </label>
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
            <label htmlFor="password" style={{ width: "100px" }}>
              Password
            </label>
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
              {<Ring size={18} color="white" />}
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
