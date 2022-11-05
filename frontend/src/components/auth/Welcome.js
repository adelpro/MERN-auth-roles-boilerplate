import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useRecoilValue } from 'recoil'
import { AccessToken } from '../../recoil/atom'
import styles from '../../App.module.css'
import { MdArrowForwardIos } from 'react-icons/md'
export default function Welcome() {
    const accessToken = useRecoilValue(AccessToken)
    const { username, status, isAdmin } = useAuth()
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItem: 'center',
                flex: 1,
            }}
        >
            <h1>
                Welcome {username} [ {status} ]
            </h1>
            <p style={{ wordWrap: 'break-word', margin: 10 }}>
                <strong>accessToken: </strong>
                {accessToken}
            </p>
            <p>
                <strong>Current server: </strong>
                {process.env.REACT_APP_BASEURL || 'http://localhost:3500'}
            </p>
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
    )
}
