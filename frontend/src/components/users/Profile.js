import React, { useState } from 'react'
import { axiosPrivate } from '../../api/axios'
import styles from '../../App.module.css'

export default function Profile() {
  const [image, setImage] = useState({ preview: '', data: '' })
  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', image.data)
    try {
      await axiosPrivate.post('/users', { body: formData })
    } catch {
      return
    }
  }

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        flex: 1,
      }}
    >
      <h1>user</h1>
      {image.preview ? (
        <img src={image.preview} width="300" height="300" alt="Preview" />
      ) : null}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, , image/jpg"
        ></input>
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}
