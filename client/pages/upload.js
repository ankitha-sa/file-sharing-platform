// pages/upload.js (or wherever your UploadPage lives)
import React, { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('❌ Please select a file first.');

    const token = localStorage.getItem('token'); // Ensure it's stored at login
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(`✅ Upload successful: ${res.data.message}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Secure File Upload</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleChange} /><br /><br />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
