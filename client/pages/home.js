//home.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [sentFiles, setSentFiles] = useState([]);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [form, setForm] = useState({ receiverEmail: '', file: null });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');

    if (!token || !storedUser) {
      router.push('/');
    } else {
      setUsername(storedUser);
      fetchFiles(storedUser);
    }
  }, []);

  const fetchFiles = async (userEmail) => {
    try {
      const sent = await axios.get(`http://localhost:5000/api/files/sent/${userEmail}`);
      const received = await axios.get(`http://localhost:5000/api/files/received/${userEmail}`);
      setSentFiles(sent.data);
      setReceivedFiles(received.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file || !form.receiverEmail) return;

    const data = new FormData();
    data.append('file', form.file);
    data.append('senderEmail', username);
    data.append('receiverEmail', form.receiverEmail);

    try {
      await axios.post('http://localhost:5000/api/files/send', data);
      setMessage('✅ File sent successfully!');
      fetchFiles(username);
      setForm({ receiverEmail: '', file: null });
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to send file.');
    }
  };

  const handleDownload = (filePath, filename) => {
    const fileName = filePath.split(/[/\\]/).pop();
    const downloadUrl = `http://localhost:5000/download/${fileName}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (fileId) => {
  if (!window.confirm('Are you sure you want to delete this file?')) return;

  try {
    await axios.delete(`http://localhost:5000/api/files/${fileId}`);
    alert('File deleted!');
    fetchFiles(username); // refresh files
  } catch (err) {
    console.error('Delete error:', err);
    alert('❌ Failed to delete file.');
  }
};



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
  };

  const formatDate = (ts) => {
  if (!ts) return 'Unknown';
  const date = new Date(ts);
  return date.toLocaleString();
};


  const buttonStyle = {
    marginRight: 10,
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: 4,
    fontSize: 14,
    marginTop: 5,
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Welcome, {username} 🎉</h1>
      <p>You are logged in!</p>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 16px',
          backgroundColor: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          marginBottom: 30,
        }}
      >
        Logout
      </button>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <h3>📤 Send a File</h3>
        <input
          type="email"
          name="receiverEmail"
          placeholder="Receiver Email"
          value={form.receiverEmail}
          onChange={handleInputChange}
          required
          style={{ display: 'block', marginBottom: 10 }}
        />
        <input
          type="file"
          onChange={handleFileChange}
          required
          style={{ display: 'block', marginBottom: 10 }}
        />
        <button type="submit">Send File</button>
      </form>

      {message && <p>{message}</p>}

      <div style={{ marginTop: 30 }}>
  <h3>📤 Sent Files</h3>
  <ul>
    {sentFiles.map((file, index) => (
      <li key={index} style={{ marginBottom: 15 }}>
        <a
          href={`http://localhost:5000/${file.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#3498db', fontWeight: 'bold', marginRight: 10 }}
        >
          {file.originalName}
        </a>
        ➡️ To: {file.receiverEmail} <br />
        📅 {formatDate(file.uploadedAt || file.timestamp || file.createdAt)} <br />
        <button
          onClick={() => handleDownload(file.filePath, file.originalName)}
          style={{ ...buttonStyle, backgroundColor: '#2ecc71' }}
        >
          Download
        </button>
        <button
        onClick={() => handleDelete(file._id)}
        style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}
>
          Delete
           </button>

      </li>
    ))}
  </ul>
</div>


      

    </div>
  );
}
