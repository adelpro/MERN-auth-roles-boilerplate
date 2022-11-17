import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowForwardIos, MdDeleteOutline, MdBorderColor, MdAdd } from 'react-icons/md';
import { useRecoilValue } from 'recoil';
import styles from '../../App.module.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { AccessToken } from '../../recoil/atom';

export default function NotesList() {
  const accessToken = useRecoilValue(AccessToken);
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
        const result = await axiosPrivate.get('/notes', {
          signal: controller.signal
        });
        setData(result?.data);
        setError(null);
      } catch (err) {
        setData(null);
        setError(err?.response?.message);
      } finally {
        setIsloading(false);
      }
    };
    if (accessToken) getNotes();
    return () => {
      controller?.abort();
    };
  }, [axiosPrivate, accessToken]);

  const handleDeleteNote = async (id) => {
    try {
      const result = await axiosPrivate.delete('/notes', { data: { id } });
      setData(() => data.filter((item) => item._id !== id));
      setMessage(result?.data?.message);
      messageRef.current.focus();
    } catch (err) {
      setMessage(err?.response?.data?.message);
      messageRef.current.focus();
    }
  };
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
              // eslint-disable-next-line no-underscore-dangle
              <div key={note._id}>
                <li style={{ height: '100%' }}>
                  <div style={{ marginLeft: 10, width: '80%' }}>
                    <h3>
                      <MdArrowForwardIos style={{ marginRight: 10 }} />
                      {note.title}
                    </h3>
                    <hr className="dashed" />
                    <p style={{ wordWrap: 'break-word' }}>{note.text}</p>
                    {note.completed ? <p>✅ Completed</p> : <p>❌ Not completed</p>}
                  </div>
                  <div>
                    {/* eslint-disable-next-line no-underscore-dangle */}
                    <button type="button" onClick={() => handleDeleteNote(note._id)}>
                      <MdDeleteOutline />
                    </button>
                    {/* eslint-disable-next-line no-underscore-dangle */}
                    <button type="button" onClick={() => navigate(`/dash/notes/${note._id}`)}>
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
      <div className={styles.center}>
        <button
          type="button"
          className={styles.button}
          onClick={() => navigate('/dash/notes/addnote')}>
          <div className={styles.center}>
            <MdAdd size={30} style={{ marginRight: 10 }} />
            Add
          </div>
        </button>
      </div>
      <p ref={messageRef} aria-live="assertive">
        {message?.message}
      </p>
    </>
  );
}
