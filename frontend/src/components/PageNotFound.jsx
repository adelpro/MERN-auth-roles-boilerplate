<<<<<<< HEAD:frontend/src/components/PageNotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../App.module.css";
import componentStyles from "./PageNotFound.module.css";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className={componentStyles.notfound}>
      <h1>
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </h1>
      <div>
        <button
          type="button"
          className={styles.button}
          style={{ width: 200 }}
          onClick={() => {
            navigate(-1);
          }}
        >
          Go back
        </button>
      </div>
    </div>
  );
=======
import { useNavigate } from 'react-router-dom'
import styles from '../App.module.css'
import componentStyles from './PageNotFound.module.css'
export default function PageNotFound() {
    const navigate = useNavigate()
    return (
        <div className={componentStyles.notfound}>
            <h1>
                <span>4</span>
                <span>0</span>
                <span>4</span>
            </h1>
            <div>
                <button
                    className={styles.button}
                    style={{ width: 200 }}
                    onClick={() => {
                        navigate(-1)
                    }}
                >
                    Go back
                </button>
            </div>
        </div>
    )
>>>>>>> v4.0.6:frontend/src/components/PageNotFound.js
}
