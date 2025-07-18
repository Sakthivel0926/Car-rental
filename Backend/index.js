require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const session = require('express-session');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const dbConfig = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: 'your_secret_key', // Change this to a strong secret in production!
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

dbConfig();

app.use('/api/cars', carRoutes);
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});