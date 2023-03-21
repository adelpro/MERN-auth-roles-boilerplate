import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  MdOutlinePersonOutline,
  MdLogout,
  MdDashboard,
  MdNotificationsNone,
  MdNotificationsActive
} from 'react-icons/md';
import { Ring } from '@uiball/loaders';
import { AccessToken, NotificationsLength } from '../recoil/atom';
import axios from '../api/axios';
import styles from '../App.module.css';
import dashstyles from './DashLayoutHeader.module.css';

export default function DashLayoutHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAccessToken = useSetRecoilState(AccessToken);
  const notificationsLength = useRecoilValue(NotificationsLength);
  const [isloading, setIsloading] = useState(false);  

  const logoutHandler = async () => {
    // send logout request
    setIsloading(true);
    await axios
      .post('/auth/logout')
      .then(() => {
        setAccessToken(null);
        setIsloading(false);
        navigate('/');
      })
      .catch(() => {
        setIsloading(false);
      });
  };


  return (
    <div className={dashstyles.dash__header__container}>
      <h1>MERN - auth - roles</h1>
      <div className={styles.center}>
        <button
          className={styles.button}
          type="button"
          onClick={() => {
            navigate(location.state?.from?.pathname || '/dash', {
              replace: true
            });
          }}>
          <div className={styles.center}>
            <MdDashboard size={30} style={{ marginRight: 10 }} />
            Dash
          </div>
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={() => {
            navigate(location.state?.from?.pathname || '/dash/profile', {
              replace: true
            });
          }}>
          <div className={styles.center}>
            <MdOutlinePersonOutline size={30} style={{ marginRight: 10 }} />
            Profile
          </div>
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={() => {
            navigate(location.state?.from?.pathname || '/dash/notifications', {
              replace: true
            });
          }}>
          <div className={styles.center}>
            {notificationsLength ? (
              <MdNotificationsActive size={30} style={{ marginRight: 10 }} />
            ) : (
              <MdNotificationsNone size={30} style={{ marginRight: 10 }} />
            )}
            {`(${notificationsLength})`}
          </div>
        </button>
        <button
          className={styles.button}
          onClick={logoutHandler}
          disabled={isloading}
          type="button">
          {!isloading ? (
            <div className={styles.center}>
              <MdLogout size={30} style={{ marginRight: 10 }} />
              Logout
            </div>
          ) : (
            <div className={styles.center}>
              <Ring size={18} color="white" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
