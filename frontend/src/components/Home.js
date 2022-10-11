import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../App.module.css";
export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Home</h1>

      <p>Welcome to MERN auth with roles application</p>
      <button className={styles.button} onClick={() => navigate("/login")}>
        Login
      </button>
    </>
  );
}
