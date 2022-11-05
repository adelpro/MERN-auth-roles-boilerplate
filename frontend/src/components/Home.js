import { useNavigate } from 'react-router-dom'
import styles from '../App.module.css'
import { MdLogin } from 'react-icons/md'

export default function Home() {
    const navigate = useNavigate()
    return (
        <>
            <h1>Home</h1>
            <p>Welcome to MERN auth with roles application</p>
            <button
                className={styles.button}
                onClick={() => navigate('/login')}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <MdLogin size={30} style={{ marginRight: 10 }} />
                    Login
                </div>
            </button>
        </>
    )
}
