// backend/app.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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

app.get('/api/programs', async (req, res) => {
  try {
    // Execute the query to get all programs
    const [rows] = await db.query('SELECT * FROM health_programs ORDER BY id DESC');
    
    // Respond with the results as JSON
    res.json(rows);
  } catch (err) {
    console.error('Database query failed:', err.message);
    
    // Return a 500 error with the error message
    res.status(500).send('Database query failed');
  }
});


// Client Endpoints
app.post('/api/clients', async (req, res) => {
  const { firstName, lastName, dateOfBirth, gender, contactNumber, email, address } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).send('First name and last name are required');
  }

  const sql = `
    INSERT INTO clients 
    (first_name, last_name, date_of_birth, gender, contact_number, email, address) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Insert the new client into the clients table
    const [result] = await db.query(sql, [firstName, lastName, dateOfBirth, gender, contactNumber, email, address]);
    
    // Now retrieve the newly created client to send back the details
    const [client] = await db.query('SELECT * FROM clients WHERE id = ?', [result.insertId]);
    
    // Respond with the client data
    res.status(201).json(client);
  } catch (err) {
    console.error('Error inserting client:', err.message);
    res.status(500).send(err.message);
  }
});

app.post('/api/enroll', async (req, res) => {
  const { clientId, programId } = req.body;

  if (!clientId || !programId) {
    return res.status(400).send('Client ID and Program ID are required');
  }

  const sql = 'INSERT INTO client_programs (client_id, program_id) VALUES (?, ?)';
  
  try {
    const [result] = await db.query(sql, [clientId, programId]);
    res.status(201).send('Client enrolled in program');
  } catch (err) {
    console.error('Error enrolling client in program:', err.message);
    res.status(500).send(err.message);
  }
});


app.get('/api/clients', async (req, res) => {
  try {
    // Execute the query to get all clients
    const [results] = await db.query('SELECT * FROM clients');
    
    // Respond with the results as JSON
    res.json(results);
  } catch (err) {
    console.error('Database query failed:', err.message);
    
    // Return a 500 error with the error message
    res.status(500).send('Database query failed');
  }
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

app.get('/api/clients/:clientId', async (req, res) => {
  const clientId = req.params.clientId;

  try {
    // Fetch client info
    const [clientResult] = await db.query('SELECT * FROM clients WHERE id = ?', [clientId]);

    if (clientResult.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const client = clientResult[0];

    // Fetch programs associated with the client
    const [programsResult] = await db.query(`
      SELECT hp.id, hp.name, hp.description
      FROM client_programs cp
      JOIN health_programs hp ON cp.program_id = hp.id
      WHERE cp.client_id = ?
    `, [clientId]);

    // Add programs array to the client object
    client.programs = programsResult;

    // Respond with full data
    res.json(client);
  } catch (err) {
    console.error('Error fetching client profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
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



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});