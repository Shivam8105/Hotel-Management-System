const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8107;

app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import Email model
const Email = require('./email-schema.js');  // Adjust path to where your Email model is located

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get('/', (req, res) => {
  res.send('Email server is running!');
});

// POST route to send an email and save booking details
app.post("/email", async (req, res) => {
  const { to, subject, text, room_type, checkin_date, checkout_date } = req.body;

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

    // Save the email details to the database
    const email = new Email({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      room_type,
      checkin_date: new Date(checkin_date),  // Save as Date
      checkout_date: new Date(checkout_date) // Save as Date
    });

    await email.save();
    console.log('Email saved to database:', email);

    res.status(200).json({ message: 'Email sent and saved successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

// GET route to fetch all bookings
app.get('/booking', async (req, res) => {
  try {
    const bookings = await Email.find(); // Fetch all email records (bookings)
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
