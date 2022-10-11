import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdDeleteOutline } from "react-icons/md";
import { MdBorderColor, MdAdd } from "react-icons/md";
import styles from "../../App.module.css";
export default function UsersList() {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const messageRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    //TODO working on...
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
  }, [axiosPrivate]);

  const handleDeleteUser = async (id) => {
    try {
      const result = await axiosPrivate.delete("/users", { data: { id } });
      setData((prev) => data.filter((item) => item._id !== id));
      setMessage(result?.data?.message);
      messageRef.current.focus();
    } catch (err) {
      setMessage(err?.response?.data?.message);
      messageRef.current.focus();
    }
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
      <h1>Users list</h1>
      <ul className={styles.list}>
        {data.map((user) => {
          return (
            <div key={user._id}>
              <li>
                <div>
                  {user.username} - [
                  {user.roles.map((role) => (
                    <span key={role}>{role} ,</span>
                  ))}
                  ]
                </div>
                <div>
                  <button onClick={() => handleDeleteUser(user._id)}>
                    <MdDeleteOutline />
                  </button>
                  <button onClick={() => navigate(`/dash/users/${user._id}`)}>
                    <MdBorderColor />
                  </button>
                </div>
              </li>
              <div className={styles.divider}></div>
            </div>
          );
        })}
      </ul>
      <button
        className={styles.button}
        onClick={() => navigate("/dash/users/signin")}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MdAdd size={30} style={{ marginRight: 10 }} />
          Add
        </div>
      </button>
      <p ref={messageRef} aria-live="assertive">
        {message?.message}
      </p>
    </>
  );
}
