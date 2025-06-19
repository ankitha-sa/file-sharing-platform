//authRoutes.js

const express = require('express');
const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('Forgot password requested for:', email);

  if (!email) return res.status(400).json({ message: 'Email is required' });

  // Simulate sending a reset link
  // In real implementation: check if user exists, generate token, send email
  return res.json({ message: 'Reset link sent to email (simulation)' });
});

module.exports = router;
