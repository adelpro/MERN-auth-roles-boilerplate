import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Welcome() {
  const { username, status, isAdmin } = useAuth();
  return (
    <>
      <p>
        Welcome {username} [ {status} ]
      </p>
      <p>
        <Link to="/dash/notes"> View Notes</Link>
      </p>
      {isAdmin && (
        <p>
          <Link to="/dash/users"> View Users</Link>
        </p>
      )}
    </>
  );
}
