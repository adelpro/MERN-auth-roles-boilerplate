<<<<<<< HEAD:frontend/src/components/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import styles from "../App.module.css";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Home</h1>
      <p>Welcome to MERN auth with roles application</p>
      <button type="button" className={styles.button} onClick={() => navigate("/login")}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MdLogin size={30} style={{ marginRight: 10 }} />
          Login
        </div>
      </button>
    </>
  );
=======
import { useNavigate } from 'react-router-dom'
import styles from '../App.module.css'
import { MdLogin } from 'react-icons/md'

export default function Home() {
    const navigate = useNavigate()
    return (
        <>
            <h1>Home</h1>
            <p>Welcome to MERN auth with roles application</p>
            <button
                className={styles.button}
                onClick={() => navigate('/login')}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <MdLogin size={30} style={{ marginRight: 10 }} />
                    Login
                </div>
            </button>
        </>
    )
>>>>>>> v4.0.6:frontend/src/components/Home.js
}
