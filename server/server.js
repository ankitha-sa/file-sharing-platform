//server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');
const app = express();
const PORT = 5000;
const authRoutes = require('./routes/authRoutes');
const File = require('./models/File');


const MONGO_URI = 'mongodb://localhost:27017/sfsharing'; // Replace with your DB name

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/files', fileRoutes);
app.use('/', fileRoutes);
app.use('/api/auth', authRoutes);
// Helpers for users
const SECRET_KEY = 'myjwtsecret';
const getUsers = () => JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
const saveUsers = (users) => fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const users = fs.existsSync('users.json') ? getUsers() : [];

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: '✅ Registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ message: '❌ Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: '❌ Invalid username or password' });
    }

    res.status(200).json({
      message: '✅ Login successful',
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if file exists first
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
