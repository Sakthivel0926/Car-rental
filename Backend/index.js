require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors'); 
const app = express();
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const dbConfig = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');


const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173','https://car-rental-7-5f1j.onrender.com'];
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
// app.use(session({
//   secret: 'your_secret_key', // Change this to a strong secret in production!
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false } // Set to true if using HTTPS
// }));

// app.use(session({
//   secret: 'your_secret_key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,         // ✅ REQUIRED for HTTPS (Render is HTTPS)
//     sameSite: 'none',
//     httpOnly: true     // ✅ REQUIRED for cross-site cookies
//   }
// }));

const MongoStore = require('connect-mongo');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/car-rental-sessions',
    ttl: 14 * 24 * 60 * 60, // Optional: session lifetime in seconds (14 days)
  }),
  cookie: {
    secure: false,           // false for HTTP, true for HTTPS
    sameSite: 'lax',         // 'none' only needed for cross-site HTTPS
    httpOnly: true
  }
}));



dbConfig();

app.use('/api/cars', carRoutes);
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});