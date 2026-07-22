const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes below require a valid token
router.use(authMiddleware);

// CREATE - add a new application
router.post('/', async (req, res) => {
  const { company_name, role_title, status, notes } = req.body;
  const userId = req.user.userId;

  if (!company_name || !role_title) {
    return res.status(400).json({ error: 'Company name and role title are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO applications (user_id, company_name, role_title, status, notes)
       VALUES ($1, $2, $3, COALESCE($4, 'applied'), $5)
       RETURNING *`,
      [userId, company_name, role_title, status, notes]
    );
    res.status(201).json({ success: true, application: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// READ - get all applications for the logged-in user
router.get('/', async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, applications: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE - edit an application (e.g., change status)
router.put('/:id', async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { company_name, role_title, status, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE applications
       SET company_name = COALESCE($1, company_name),
           role_title = COALESCE($2, role_title),
           status = COALESCE($3, status),
           notes = COALESCE($4, notes)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [company_name, role_title, status, notes, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, application: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE - remove an application
router.delete('/:id', async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;