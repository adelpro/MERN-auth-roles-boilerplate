import { useEffect, useRef, useState } from 'react';
import { MdArrowForwardIos, MdDeleteOutline, MdDeleteSweep, MdDoneAll } from 'react-icons/md';
import { useRecoilValue } from 'recoil';
import styles from '../../App.module.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { AccessToken, NotificationsLength } from '../../recoil/atom';
import useAuth from '../../hooks/useAuth';

export default function NotificationsList() {
  const { id } = useAuth();
  const [limit] = useState(3);
  const [page, setPage] = useState(0);
  const accessToken = useRecoilValue(AccessToken);
  const notificationsLength = useRecoilValue(NotificationsLength);
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const messageRef = useRef();
  useEffect(() => {
    setIsloading(true);
    const controller = new AbortController();
    const getNotifications = async () => {
      try {
        const result = await axiosPrivate.post(
          '/notifications',
          {
            id,
            limit,
            page
          },
          {
            signal: controller.signal
          }
        );
        setData(result?.data);
        setError(null);
      } catch (err) {
        setData(null);
        setError(err?.response?.message);
      } finally {
        setIsloading(false);
      }
    };
    if (accessToken) getNotifications();
    return () => {
      controller?.abort();
    };
  }, [axiosPrivate, accessToken]);
  const handleMarkAllAsRead = async () => {
    try {
      const result = await axiosPrivate.patch('/notifications/all', { id });
      const newData = data;
      newData.notifications.forEach((element) => {
        const obj = element;
        obj.read = true;
        return obj;
      });
      setData(newData);
      setMessage(result?.data?.message);
      messageRef.current.focus();
    } catch (err) {
      setMessage(err?.response?.data?.message);
      messageRef.current.focus();
    }
  };
  const handleDeleteNotification = async (notificationId) => {
    try {
      const result = await axiosPrivate.delete('/notifications', { data: { id: notificationId } });
      const newData = data?.notifications?.filter((item) => item._id !== notificationId);
      console.log(newData);
      setData(newData);
      setMessage(result?.data?.message);
      messageRef.current.focus();
    } catch (err) {
      setMessage(err?.response?.data?.message);
      messageRef.current.focus();
    }
  };
  const handleDeleteAll = async () => {
    try {
      const result = await axiosPrivate.delete('/notifications/all', { data: { id } });
      setData();
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
      <h1>Notifications list</h1>
      <div>No data to show</div>
    </>
  );

  if (data?.notifications?.length > 0) {
    content = (
      <>
        <h1>Notifications list</h1>
        <ul className={styles.list}>
          {data?.notifications?.map((notification) => {
            return (
              <div key={notification._id}>
                <li style={{ height: '100%' }}>
                  <div style={{ marginLeft: 10, width: '80%' }}>
                    <h3>
                      <MdArrowForwardIos style={{ marginRight: 10 }} />
                      {notification.title}
                    </h3>
                    <hr className="dashed" />
                    <p style={{ wordWrap: 'break-word' }}>{notification.text}</p>
                    {notification.read ? <p>✅ read</p> : <p>❌ Not read</p>}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteNotification(notification._id);
                      }}>
                      <MdDeleteOutline />
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
          disabled={!data?.notifications?.length || !notificationsLength}
          className={styles.button}
          style={{ width: 200 }}
          onClick={() => handleMarkAllAsRead()}>
          <div className={styles.center}>
            <MdDoneAll size={30} style={{ marginRight: 10 }} />
            Mark all as read
          </div>
        </button>
        <button
          type="button"
          disabled={!data?.notifications?.length}
          className={styles.button}
          style={{ width: 200 }}
          onClick={() => handleDeleteAll()}>
          <div className={styles.center}>
            <MdDeleteSweep size={30} style={{ marginRight: 10 }} />
            Delete all
          </div>
        </button>
      </div>
      <div className={styles.center}>
        <button
          type="button"
          disabled={page === 0}
          onClick={() => {
            setPage((prev) => prev - 1);
          }}>
          {'<'}
        </button>
        <div style={{ marginLeft: '5px', marginRight: '5px' }}>
          page: {page + 1} / {data?.totalpage}
        </div>
        <button
          type="button"
          disabled={data?.totalpage === page + 1}
          onClick={() => {
            setPage((prev) => prev + 1);
          }}>
          {'>'}
        </button>
      </div>
      <p ref={messageRef} aria-live="assertive">
        {message?.message}
      </p>
    </>
  );
}
