const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ─── CORS Configuration ────────────────────────────────────────────────────
// Explicitly including your live Vercel URL to prevent "Registration Failed"
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://calm-campus-gamma.vercel.app', // Added explicitly for exhibition safety
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── MongoDB Atlas Connection ──────────────────────────────────────────────
const connectDB = async () => {
  try {
    // Ensure you have set MONGODB_URI in Render Environment Variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};
connectDB();

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/journal', require('./routes/journal'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Stress Assessment API',
    ai_status: process.env.AI_SERVICE_URL ? "configured" : "missing"
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Accepting requests from: ${allowedOrigins.join(', ')}`);
});