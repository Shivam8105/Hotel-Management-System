const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');  // Import nodemailer
require("dotenv").config(); // Add parentheses to invoke config
const app = express();
const PORT = process.env.PORT || 8107;

app.use(express.json());

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Create a nodemailer transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Can be any email service, or use SMTP settings
  auth: {
    user: process.env.EMAIL_USER,  // Your email address from .env
    pass: process.env.EMAIL_PASS   // Your email password or App password
  }
});

app.get('/', (req, res) => {
  res.send('Email server is running!');
});

// POST route to send an email
app.post("/email", async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender email
    to,                           // Recipient email from request
    subject,                      // Email subject from request
    text                          // Email body text from request
  };

  try {
    // Send email using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
