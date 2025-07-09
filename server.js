require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

// Connect to the database
connectDB();

const app = express();

// --- THE NETWORK ERROR FIX IS HERE ---
// This tells our backend to specifically trust your live frontend URL.
// Make sure this URL exactly matches your Vercel deployment URL.
const corsOptions = {
  origin: 'https://ai-study-buddy-frontend.vercel.app',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
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
