import { useNavigate } from 'react-router-dom';
import { MdLogin } from 'react-icons/md';
import styles from '../App.module.css';

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Home</h1>

      <h2>Welcome to MERN-auth-roles application</h2>
      <p>
        A full-stack application that allows you to manage authentication and roles for users, using
        MERN and
      </p>
      <button className={styles.button} onClick={() => navigate('/login')} type="button">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <MdLogin size={30} style={{ marginRight: 10 }} />
          Login
        </div>
      </button>
    </>
  );
}
