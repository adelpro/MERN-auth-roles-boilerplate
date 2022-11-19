import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Ring } from '@uiball/loaders';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MdLogin, MdPassword, MdRemoveRedEye } from 'react-icons/md';
import { AccessToken, Persist } from '../../recoil/atom';
import styles from '../../App.module.css';
import axios from '../../api/axios';

export default function Login() {
  const setAccessToken = useSetRecoilState(AccessToken);
  const [persist, setPersist] = useRecoilState(Persist);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const usernameRef = useRef();
  const [passwordType, setPasswordType] = useState(true);
  const errorRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    setError(null);
    try {
      const result = await axios.post('/auth', { username, password }, { withCredentials: true });
      if (result?.data?.accessToken) {
        setAccessToken(result?.data?.accessToken);
      }
      setIsloading(false);
      setError(null);
      setUsername('');
      setPassword('');
      navigate(location.state?.from?.pathname || '/dash', {
        replace: true
      });
    } catch (err) {
      if (!err?.response?.status) {
        setError('No server response');
      } else if (err?.response?.status === 400) {
        setError('Missing username or password');
      } else if (err?.response?.status === 401) {
        setError('Unauthorized');
      } else {
        setError(err?.message);
      }
      setIsloading(false);
      errorRef.current.focus();
    }
  };
  useEffect(() => usernameRef.current.focus(), []);
  useEffect(() => setError(null), [username, password]);
  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <MdLogin size={30} style={{ marginRight: 10 }} />
        <h1>Login </h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.form__container}>
        <div>
          <div className={styles.form__control__container}>
            <label htmlFor="username" style={{ width: '100px' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={usernameRef}
            />
          </div>
          <div className={styles.form__control__container}>
            <label htmlFor="password">Password</label>
            <div
              className={styles.center}
              style={{
                position: 'relative',
                border: '2px solid',
                borderRadius: '4px'
              }}>
              <input
                id="password"
                type={passwordType ? 'password' : 'text'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={usernameRef}
                style={{
                  border: 'none',
                  borderRadius: 0,
                  outline: 'none'
                }}
              />

              <div
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  width: 20,
                  padding: 5,
                  right: 0,
                  border: 'none'
                }}
                aria-hidden="true"
                onClick={() => setPasswordType((prev) => !prev)}>
                {passwordType ? <MdPassword /> : <MdRemoveRedEye />}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.form__control__container__checkbox}>
          <input
            id="persist"
            type="checkbox"
            checked={persist}
            onChange={() => setPersist((current) => !current)}
          />
          <label htmlFor="persist">Trust this device</label>
        </div>
        <button className={styles.button} type="submit" disabled={isloading}>
          {!isloading ? (
            <div className={styles.center}>
              <MdLogin size={30} style={{ marginRight: 10 }} />
              Login
            </div>
          ) : (
            <div className={styles.center}>
              <Ring size={18} color="white" />
            </div>
          )}
        </button>
        <p ref={errorRef} aria-live="assertive">
          {error}
        </p>
      </form>
    </section>
  );
}
