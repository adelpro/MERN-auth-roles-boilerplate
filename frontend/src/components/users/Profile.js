import { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import styles from '../../App.module.css'
import useAuth from '../../hooks/useAuth'
import { MdOutlinePersonOutline, MdFileUpload } from 'react-icons/md'
import { Ring } from '@uiball/loaders'

export default function Profile() {
  const axiosPrivate = useAxiosPrivate()
  const { username, roles, profileImage, id } = useAuth()
  const [image, setImage] = useState({
    preview: null,
    data: null,
  })
  const [isloading, setIsloading] = useState(false)
  const [message, setMessage] = useState('')
  const messageRef = useRef()
  useEffect(() => {
    setImage((prev) => ({ ...prev, preview: profileImage }))
  }, [profileImage])
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsloading(true)
    setMessage(null)
    let formData = new FormData()
    formData.append('image', image.data)
    formData.append('id', id)
    await axiosPrivate
      .post(`/users/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((result) => {
        setIsloading(false)
        setMessage(result?.response?.message)
      })
      .catch((err) => {
        setIsloading(false)
        if (!err?.response?.status) {
          setMessage(
            err?.response?.statusText
              ? err?.response?.statusText
              : 'No server response'
          )
        } else if (err?.response?.status === 409) {
          setMessage('Username exist already')
        } else if (err?.response?.status === 401) {
          setMessage('Unauthorized')
        } else {
          setMessage(err?.response?.statusText)
        }
      })
  }

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }
  return (
    <section>
      <div className={styles.form__container}>
        <div className={styles.center}>
          <MdOutlinePersonOutline size={30} style={{ marginRight: 10 }} />
          <h1>Profile</h1>
        </div>
        <div className={styles.form__control__container}>
          <span>{username}</span>
        </div>
        <div className={styles.form__control__container}>
          <span>
            [
            {roles.map((role, i, roles) =>
              i + 1 === roles.length ? (
                <span key={role}>{role}</span>
              ) : (
                <span key={role}>{role} ,</span>
              )
            )}
            ]
          </span>
        </div>
        {image.preview ? (
          <img
            src={image.preview}
            width="300"
            height="300"
            alt="Preview"
            style={{ border: '1px solid black' }}
          />
        ) : (
          <div
            style={{
              width: '300px',
              height: '300px',
              backgroundColor: '#cccc',
              border: '1px solid black',
            }}
          />
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.center}>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, , image/jpg"
              style={{ width: '300px' }}
            />
          </div>
          <div className={styles.center}>
            <button
              type="submit"
              disabled={isloading || !image.preview}
              className={styles.button}
            >
              <div className={styles.center}>
                {!isloading ? (
                  <div className={styles.center}>
                    <MdFileUpload size={30} style={{ marginRight: 10 }} />
                    Upload
                  </div>
                ) : (
                  <div className={styles.center}>
                    {<Ring size={18} color="white" />}
                  </div>
                )}
              </div>
            </button>
          </div>
          <div className={styles.center}>
            <p ref={messageRef} aria-live="assertive">
              {message ? JSON.stringify(message) : null}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
