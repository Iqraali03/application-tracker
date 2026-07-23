const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('../db');
const authRoutes = require('../routes/auth');
const applicationRoutes = require('../routes/applications');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

module.exports = app;