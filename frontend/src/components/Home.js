import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Home</h1>

      <p>Welcome to MERN auth with roles application</p>
      <button onClick={() => navigate("/login")}>Login</button>
    </>
  );
}
