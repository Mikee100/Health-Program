// backend/app.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Health Programs Endpoints
app.post('/api/programs', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).send('Program name is required');

  const sql = 'INSERT INTO health_programs (name, description) VALUES (?, ?)';
  db.query(sql, [name, description], (err, result) => {
    if (err) return res.status(500).send(err.message);
    
    db.query('SELECT * FROM health_programs WHERE id = ?', [result.insertId], (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.status(201).json(rows[0]);
    });
  });
});

app.get('/api/programs', (req, res) => {
  db.query('SELECT * FROM health_programs ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows); // ✅ should be an array
  });
});


// Client Endpoints
app.post('/api/clients', (req, res) => {
  const { firstName, lastName, dateOfBirth, gender, contactNumber, email, address } = req.body;
  
  if (!firstName || !lastName) {
    return res.status(400).send('First name and last name are required');
  }

  const sql = `
    INSERT INTO clients 
    (first_name, last_name, date_of_birth, gender, contact_number, email, address) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, 
    [firstName, lastName, dateOfBirth, gender, contactNumber, email, address], 
    (err, result) => {
      if (err) return res.status(500).send(err.message);
      
      db.query('SELECT * FROM clients WHERE id = ?', [result.insertId], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.status(201).json(rows[0]);
      });
    }
  );
});
app.post('/api/enroll', (req, res) => {
  const { clientId, programId } = req.body;

  if (!clientId || !programId) {
    return res.status(400).send('Client ID and Program ID are required');
  }

  const sql = 'INSERT INTO client_programs (client_id, program_id) VALUES (?, ?)';
  db.query(sql, [clientId, programId], (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.status(201).send('Client enrolled in program');
  });
});


app.get('/api/clients', (req, res) => {
  const sql = 'SELECT * FROM clients';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

app.get('/api/clients/search', (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).send('Search query is required');

  const sql = `
    SELECT * FROM clients 
    WHERE first_name LIKE ? OR last_name LIKE ? OR contact_number LIKE ?
  `;
  db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

app.get('/api/clients/:id', (req, res) => {
  const sql = 'SELECT * FROM clients WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err.message);
    if (results.length === 0) return res.status(404).send('Client not found');
    res.json(results[0]);
  });
});

// Program Enrollment Endpoints
app.post('/api/clients/:id/enroll', (req, res) => {
  const { programId } = req.body;
  if (!programId) return res.status(400).send('Program ID is required');

  const sql = `
    INSERT INTO client_programs 
    (client_id, program_id, enrollment_date) 
    VALUES (?, ?, CURDATE())
  `;
  
  db.query(sql, [req.params.id, programId], (err, result) => {
    if (err) return res.status(500).send(err.message);
    
    const getEnrollmentSql = `
      SELECT hp.*, cp.status, cp.enrollment_date 
      FROM client_programs cp
      JOIN health_programs hp ON cp.program_id = hp.id
      WHERE cp.id = ?
    `;
    
    db.query(getEnrollmentSql, [result.insertId], (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.status(201).json(rows[0]);
    });
  });
});

app.get('/api/clients/:id/programs', (req, res) => {
  const sql = `
    SELECT hp.*, cp.status, cp.enrollment_date 
    FROM client_programs cp
    JOIN health_programs hp ON cp.program_id = hp.id
    WHERE cp.client_id = ?
  `;
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});