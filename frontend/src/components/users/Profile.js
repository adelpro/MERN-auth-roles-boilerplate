import React, { useState } from 'react'
import { axiosPrivate } from '../../api/axios'

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
    <>
      <h1>user</h1>
      {image.preview ? (
        <img src={image.preview} width="100" height="100" alt="Preview" />
      ) : null}
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={handleFileChange}></input>
        <button type="submit">Upload</button>
      </form>
    </>
  )
}
