# 🔐 Secure File Sharing Platform

A simple and secure platform for uploading, sending, and receiving files using user authentication. Built with **Node.js**, **Express**, **MongoDB**, and **Next.js**.

---

## 🚀 Features

- 🔒 User Registration & Login with hashed passwords
- ✅ JWT-based session authentication
- 📤 Upload & send files to other registered users
- 📥 View sent files with download and delete support
- 📁 Files stored on server & backed in MongoDB
- 🧠 Brute-force protection on login
- 🧾 Forgot password email reset flow 

🛠 Run the Application
In two separate terminals:
Backend (Server):

bash

cd server

node server.js

Frontend (Client):

bash

cd client

npm run dev

Then go to http://localhost:3000 in your browser.

🔐 Security Features (Implemented)

✅ Password hashing using bcrypt

✅ JWT token generation and storage on login

✅ Brute-force protection (locks after 3 failed attempts)

✅ Forgot password email flow

✅ CORS enabled for secure frontend-backend communication

✅ Files sent only between sender and receiver (email-based filter)

✅ File deletion with ID validation

✅ MongoDB used to securely store file metadata

✅ Files served via /uploads with controlled access



