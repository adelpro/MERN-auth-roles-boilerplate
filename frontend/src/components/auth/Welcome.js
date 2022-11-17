import { Link } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { MdArrowForwardIos } from 'react-icons/md';
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { AccessToken, NotificationsLength } from '../../recoil/atom';
import styles from '../../App.module.css';
import useSocketIo from '../../hooks/useSocketIo';

export default function Welcome() {
  const accessToken = useRecoilValue(AccessToken);
  const { id, username, status, isAdmin } = useAuth();
  const { socket } = useSocketIo();
  const setNotificationsLength = useSetRecoilState(NotificationsLength);
  useEffect(() => {
    let timer;
    socket?.on('connect', () => {
      socket.emit('setUserId', id);
      // getting first notifications length
      socket.emit('getNotificationsLength', id);
      socket?.on('notificationsLength', (data) => {
        setNotificationsLength(data);
      });
      timer = setTimeout(() => {
        socket.emit('getNotificationsLength', id);
      }, 10000); // run every 10 seconds
      socket?.on('disconnect', () => {});
    });

    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('notifications');
      clearTimeout(timer);
    };
  }, [id, socket]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
      <h1>
        Welcome {username} [ {status} ]
      </h1>
      <p style={{ wordWrap: 'break-word', margin: 10 }}>
        <strong>accessToken: </strong>
        {accessToken}
      </p>

      <p style={{ wordWrap: 'break-word', margin: 10 }}>
        <strong>Current ID: </strong>
        {id}
      </p>
      <strong>Current server: </strong>
      {process.env.REACT_APP_BASEURL || 'http://localhost:3500'}

      <ul className={styles.list} style={{ width: 350 }}>
        <li>
          <div>
            <MdArrowForwardIos style={{ width: 30 }} />
            <Link to="/dash/notes"> View Notes</Link>
          </div>
        </li>
        {isAdmin && (
          <li>
            <div>
              <MdArrowForwardIos style={{ width: 30 }} />
              <Link to="/dash/users"> View Users</Link>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
