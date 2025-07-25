require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

// Connect to the database
connectDB();

const app = express();

// --- THE FINAL FIX IS HERE ---
// We are now telling our backend to trust ALL origins.
// This is a debugging step to confirm the issue is CORS.
app.use(cors());
// --- END OF FIX ---


// Middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/interview', interviewRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
