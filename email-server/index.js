const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8107;
const jwt = require('jsonwebtoken');
const User = require("./user-schema.js");
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import Email model
const Email = require("./email-schema.js"); // Adjust path to where your Email model is located

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Email server is running!");
});

// POST route to send an email and save booking details
app.post("/email", async (req, res) => {
  const {
    to,
    subject,
    text,
    room_type,
    checkin_date,
    checkout_date,
    name,
    room_price,
  } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to, // Recipient email from request
    subject, // Email subject from request
    text, // Email body text from request
  };

  try {
    // Send email using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // Save the email details to the database
    const email = new Email({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      room_type,
      checkin_date: new Date(checkin_date), // Save as Date
      checkout_date: new Date(checkout_date), // Save as Date
      name,
      room_price,
    });

    await email.save();
    console.log("Email saved to database:", email);

    res.status(200).json({ message: "Email sent and saved successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// GET route to fetch all bookings
// GET route to fetch all bookings and return required fields
app.get("/booking", async (req, res) => {
  try {
    // Fetch all bookings with necessary fields, including _id and isPaid
    const bookings = await Email.find(
      {},
      "_id name to room_type checkin_date checkout_date room_price isPaid"
    );

    // Format the response data
    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id,
      name: booking.name,
      email: booking.to,
      room_type: booking.room_type,
      checkin_date: booking.checkin_date.toISOString().split("T")[0],
      checkout_date: booking.checkout_date.toISOString().split("T")[0],
      room_price: booking.room_price,
      isPaid: booking.isPaid || false, // Default to false if not set
    }));

    // Send the formatted bookings
    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});


app.post("/register", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  // Validate input
  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    // Create a new user
    const newUser = new User({ fullName, email, password, confirmPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("HERE")

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });
    console.log("LOGGED IN")

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.delete("/deleteBooking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  // Log the received bookingId to debug
  console.log("Received bookingId:", bookingId);

  // Check if bookingId is valid
  if (!bookingId || bookingId === "undefined") {
    return res.status(400).json({
      status: "error",
      message: "Invalid booking ID provided.",
    });
  }

  try {
    // Find and delete the booking by its ID
    const result = await Email.findByIdAndDelete(bookingId);

    if (result) {
      res
        .status(200)
        .json({ status: "success", message: "Booking deleted successfully." });
    } else {
      res.status(404).json({ status: "error", message: "Booking not found." });
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

// Add this route to your existing Express server
app.post("/completeBooking", async (req, res) => {
  const { bookingId } = req.body;

  // Log the received bookingId to debug
  console.log("Completing booking with ID:", bookingId);

  // Check if bookingId is valid
  if (!bookingId || bookingId === "undefined") {
    return res.status(400).json({
      status: "error",
      message: "Invalid booking ID provided.",
    });
  }

  try {
    // Find the booking and update isPaid to true
    const result = await Email.findByIdAndUpdate(
      bookingId,
      { isPaid: true },
      { new: true } // This returns the updated document
    );

    if (result) {
      res.status(200).json({
        status: "success",
        message: "Booking payment completed successfully.",
        booking: result,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Booking not found.",
      });
    }
  } catch (error) {
    console.error("Error completing booking:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
