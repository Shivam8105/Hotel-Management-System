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
  const { to, subject, text, room_type, checkin_date, checkout_date, name, room_price } = req.body;

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
      checkout_date: new Date(checkout_date), // Save as Date
      name,
      room_price,
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
// GET route to fetch all bookings and return required fields
app.get('/booking', async (req, res) => {
  try {
    // Fetch all bookings with necessary fields (Name, Email, Room Type, Check-In Date, Check-Out Date, Room Price)
    const bookings = await Email.find({}, 'name to room_type checkin_date checkout_date room_price');

    // Format the response data
    const formattedBookings = bookings.map(booking => ({
      name: booking.name,
      email: booking.to,  // 'to' is the email field
      room_type: booking.room_type,
      checkin_date: booking.checkin_date.toISOString().split('T')[0],  // Format date as YYYY-MM-DD
      checkout_date: booking.checkout_date.toISOString().split('T')[0],  // Format date as YYYY-MM-DD
      room_price: booking.room_price
    }));

    // Send the formatted bookings
    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
