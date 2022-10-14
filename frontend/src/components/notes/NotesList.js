import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdDeleteOutline } from "react-icons/md";
import { MdBorderColor, MdAdd } from "react-icons/md";
import styles from "../../App.module.css";

export default function NotesList() {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const messageRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    setIsloading(true);
    const controller = new AbortController();
    const getNotes = async () => {
      try {
        const result = await axiosPrivate.get("/notes", {
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
    getNotes();
    return () => {
      controller?.abort();
    };
  }, [axiosPrivate]);

  const handleDeleteNote = async (id) => {
    try {
      const result = await axiosPrivate.delete("/notes", { data: { id } });
      setData(() => data.filter((item) => item._id !== id));
      setMessage(result?.data?.message);
      messageRef.current.focus();
    } catch (err) {
      setMessage(err?.response?.data?.message);
      messageRef.current.focus();
    }
  };
  console.log(data);
  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  let content = (
    <>
      <h1>Notes list</h1>
      <div>No data to show</div>
    </>
  );

  if (data && data.length > 0) {
    content = (
      <>
        <h1>Notes list</h1>
        <ul className={styles.list}>
          {data.map((note) => {
            return (
              <div key={note._id}>
                <li style={{ height: "120px" }}>
                  <div>
                    <p>Title: {note.title}</p>
                    <p>Text: {note.text}</p>
                    <p>User: {note.user}</p>
                  </div>
                  <div>
                    <button onClick={() => handleDeleteNote(note._id)}>
                      <MdDeleteOutline />
                    </button>
                    <button onClick={() => navigate(`/dash/users/${note._id}`)}>
                      <MdBorderColor />
                    </button>
                  </div>
                </li>
              </div>
            );
          })}
        </ul>
      </>
    );
  }
  // Render data
  return (
    <>
      {content}
      <button
        className={styles.button}
        onClick={() => navigate("/dash/notes/addnote")}
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
