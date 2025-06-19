//fileRoutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST /api/files/send
router.post('/send', upload.single('file'), async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
// ✅ Add this console.log here
  console.log('Uploading file:', {
    originalName: req.file.originalname,
    size: req.file.size,
  });
  // ✅ Log filename to ensure it's correct (no 'uploads/' prefix)
  console.log('Saved filePath:', req.file.filename);

  const newFile = new File({
    originalName: req.file.originalname,
    filePath: 'uploads/' + req.file.filename, // ✅ Only filename, no 'uploads/' prefix
    size: req.file.size,
    senderEmail,
    receiverEmail,
  });

  try {
    await newFile.save();
    res.json({ message: '✅ File sent successfully' });
  } catch (err) {
    console.error('Error saving file:', err);
    res.status(500).json({ message: '❌ Failed to save file' });
  }
});


// GET /api/files/sent/:email
router.get('/sent/:email', async (req, res) => {
  try {
    const files = await File.find({ senderEmail: req.params.email });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sent files' });
  }
});

// GET /api/files/received/:email
router.get('/received/:email', async (req, res) => {
  try {
    const files = await File.find({ receiverEmail: req.params.email });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching received files' });
  }
});
router.delete('/api/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    const fileName = path.basename(file.filePath); // remove full path, keep name
    const fullPath = path.join(__dirname, '../uploads', fileName);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath); // delete from disk
    }

    await File.findByIdAndDelete(req.params.id); // remove from DB
    res.send('File deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
module.exports = router;

