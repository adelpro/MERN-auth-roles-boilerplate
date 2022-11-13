import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { MdArrowForwardIos } from 'react-icons/md';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { AccessToken } from '../../recoil/atom';
import styles from '../../App.module.css';
import useSocketIo from '../../hooks/useSocketIo';

export default function Welcome() {
  const accessToken = useRecoilValue(AccessToken);
  const { id, username, status, isAdmin } = useAuth();
  const { socket } = useSocketIo();
  const [isConnected, setIsConnected] = useState();
  useEffect(() => {
    socket?.on('connect', () => {
      socket.emit('setUserId', id);
      setIsConnected(true);
      console.log(`user ${id} connect to socket`);
    });

    socket?.on('disconnect', () => {
      setIsConnected(false);
      console.log('disconnect');
    });

    socket?.on('notifications', (data) => {
      console.log({ data });
    });
    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('notifications');
    };
  }, [id, socket]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isConnected) {
        socket.emit('getNotifications', id);
      }
      console.log('sending getNotifications');
    }, 10000); // run every 10 seconds
    return () => clearTimeout(timer);
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
