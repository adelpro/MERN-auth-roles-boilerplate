import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { MdArrowForwardIos, MdDeleteOutline } from 'react-icons/md'
import { MdBorderColor, MdAdd } from 'react-icons/md'
import styles from '../../App.module.css'
import { useRecoilValue } from 'recoil'
import { AccessToken } from '../../recoil/atom'
export default function UsersList() {
  const accessToken = useRecoilValue(AccessToken)
  const axiosPrivate = useAxiosPrivate()
  const [data, setData] = useState(null)
  const [isLoading, setIsloading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const messageRef = useRef()
  const navigate = useNavigate()
  useEffect(() => {
    setIsloading(true)
    const controller = new AbortController()
    const getUsers = async () => {
      try {
        const result = await axiosPrivate.get('/users', {
          signal: controller.signal,
        })
        setData(result?.data)
        setError(null)
        setIsloading(false)
      } catch (err) {
        setData(null)
        setIsloading(false)
        setError(err?.response?.message)
      }
    }

    if (accessToken) {
      getUsers()
    }
    return () => {
      controller?.abort()
    }
  }, [axiosPrivate, accessToken])

  const handleDeleteUser = async (id) => {
    try {
      const result = await axiosPrivate.delete('/users', { data: { id } })
      setData(() => data.filter((item) => item._id !== id))
      setMessage(result?.data?.message)
      messageRef.current.focus()
    } catch (err) {
      setMessage(err?.response?.data?.message)
      messageRef.current.focus()
    }
  }
  if (error) return <div>{error.message}</div>
  if (isLoading) return <div>Loading...</div>
  let content = <div>No data to show</div>
  if (data && data.length > 0) {
    content = (
      <ul className={styles.list}>
        {data.map((user) => {
          return (
            <div key={user._id}>
              <li>
                <div>
                  <MdArrowForwardIos style={{ marginRight: 10 }} />
                  <span>{user.username}</span>
                  <span>
                    [
                    {user.roles.map((role, i, roles) =>
                      i + 1 === roles.length ? (
                        <span key={role}>{role}</span>
                      ) : (
                        <span key={role}>{role} ,</span>
                      )
                    )}
                    ]
                  </span>
                </div>
                <div>
                  <button onClick={() => handleDeleteUser(user._id)}>
                    <MdDeleteOutline />
                  </button>
                  <button onClick={() => navigate(`/dash/users/${user._id}`)}>
                    <MdBorderColor />
                  </button>
                </div>
              </li>
            </div>
          )
        })}
      </ul>
    )
  }

  return (
    <>
      <h1>Users list</h1>
      {content}
      <div className={styles.center}>
        <button
          className={styles.button}
          onClick={() => navigate('/dash/users/signin')}
        >
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
  )
}
