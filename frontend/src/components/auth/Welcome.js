import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  const date = new Date();
  const today = new Intl.DateTimeFormat("fr-DZ", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  return (
    <>
      <div>Welcome</div>
      <p>{today}</p>
      <p>
        <Link to="/dash/notes"> View Notes</Link>
      </p>
      <p>
        <Link to="/dash/users"> View Users</Link>
      </p>
    </>
  );
}
