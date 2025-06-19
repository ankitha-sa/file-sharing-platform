// client/pages/send.js
import { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';


export default function SendPage() {
  const [file, setFile] = useState(null);
  const [receiverId, setReceiverId] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const encryptFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
        const encrypted = CryptoJS.AES.encrypt(wordArray, 'secret_key').toString();
        const blob = new Blob([encrypted]);
        resolve(new File([blob], file.name));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSend = async () => {
    if (!file || !receiverId) {
      alert("Please select a file and enter receiver ID");
      return;
    }

    setStatus('Encrypting file...');

    const encryptedFile = await encryptFile(file);

    const formData = new FormData();
    formData.append('file', encryptedFile);
    formData.append('senderId', 'sender123');  // Replace with actual sender ID logic
    formData.append('receiverId', receiverId);

    try {
      await axios.post('http://localhost:5000/api/files/send', formData);
      setStatus('✅ File encrypted and sent securely!');
    } catch (error) {
      console.error(error);
      setStatus('❌ Failed to send file');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Send Encrypted File</h1>
      <input type="file" onChange={handleFileChange} />
      <br /><br />
      <input
        type="text"
        placeholder="Enter Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <br /><br />
      <button onClick={handleSend}>Send File Securely</button>
      <p>{status}</p>
    </div>
  );
}
