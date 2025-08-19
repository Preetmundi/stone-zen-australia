require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth middleware (scaffold)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// --- AUTH ENDPOINTS ---
// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) return res.status(409).json({ error: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const result = await pool.query('SELECT id, email, password FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- USERS TABLE SQL (run in psql or a migration tool) ---
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   email TEXT UNIQUE NOT NULL,
//   password TEXT NOT NULL
// );

// --- CUSTOMERS CRUD (all require authentication) ---
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  const { name, email, phone, address, city, postcode, customer_type, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const result = await pool.query(
      `INSERT INTO customers (user_id, name, email, phone, address, city, postcode, customer_type, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, name, email, phone, address, city, postcode, customer_type, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, address, city, postcode, customer_type, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE customers SET name=$1, email=$2, phone=$3, address=$4, city=$5, postcode=$6, customer_type=$7, notes=$8
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [name, email, phone, address, city, postcode, customer_type, notes, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// --- PROJECTS CRUD (all require authentication) ---
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { customer_id, project_name, project_type, status, expected_delivery, total_cost, notes, address } = req.body;
  if (!project_name) return res.status(400).json({ error: 'Project name is required' });
  try {
    const result = await pool.query(
      `INSERT INTO projects (user_id, customer_id, project_name, project_type, status, expected_delivery, total_cost, notes, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, customer_id, project_name, project_type, status, expected_delivery, total_cost, notes, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const { customer_id, project_name, project_type, status, expected_delivery, total_cost, notes, address } = req.body;
  try {
    const result = await pool.query(
      `UPDATE projects SET customer_id=$1, project_name=$2, project_type=$3, status=$4, expected_delivery=$5, total_cost=$6, notes=$7, address=$8
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [customer_id, project_name, project_type, status, expected_delivery, total_cost, notes, address, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// --- MATERIALS CRUD (all require authentication) ---
app.get('/api/materials', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materials WHERE user_id = $1 ORDER BY id DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

app.get('/api/materials/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materials WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch material' });
  }
});

app.post('/api/materials', authenticateToken, async (req, res) => {
  const { name, supplier, category, finish, sell_price, availability, lead_time, description, image_url } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const result = await pool.query(
      `INSERT INTO materials (user_id, name, supplier, category, finish, sell_price, availability, lead_time, description, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.user.id, name, supplier, category, finish, sell_price, availability, lead_time, description, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create material' });
  }
});

app.put('/api/materials/:id', authenticateToken, async (req, res) => {
  const { name, supplier, category, finish, sell_price, availability, lead_time, description, image_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE materials SET name=$1, supplier=$2, category=$3, finish=$4, sell_price=$5, availability=$6, lead_time=$7, description=$8, image_url=$9
       WHERE id=$10 AND user_id=$11 RETURNING *`,
      [name, supplier, category, finish, sell_price, availability, lead_time, description, image_url, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update material' });
  }
});

app.delete('/api/materials/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM materials WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

// --- QUOTES CRUD (all require authentication) ---
app.get('/api/quotes', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quotes WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

app.get('/api/quotes/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quotes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Quote not found' });
    // Fetch quote items
    const items = await pool.query('SELECT * FROM quote_items WHERE quote_id = $1', [req.params.id]);
    res.json({ ...result.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

app.post('/api/quotes', authenticateToken, async (req, res) => {
  const { project_id, quote_number, version, status, valid_until, subtotal, gst, total, notes, terms, items } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO quotes (user_id, project_id, quote_number, version, status, valid_until, subtotal, gst, total, notes, terms)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [req.user.id, project_id, quote_number, version, status, valid_until, subtotal, gst, total, notes, terms]
    );
    const quote = result.rows[0];
    // Insert quote items
    if (Array.isArray(items)) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO quote_items (quote_id, description, category, quantity, unit, unit_price, total_price, material_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [quote.id, item.description, item.category, item.quantity, item.unit, item.unit_price, item.total_price, item.material_id]
        );
      }
    }
    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

app.put('/api/quotes/:id', authenticateToken, async (req, res) => {
  const { project_id, quote_number, version, status, valid_until, subtotal, gst, total, notes, terms, items } = req.body;
  try {
    const result = await pool.query(
      `UPDATE quotes SET project_id=$1, quote_number=$2, version=$3, status=$4, valid_until=$5, subtotal=$6, gst=$7, total=$8, notes=$9, terms=$10
       WHERE id=$11 AND user_id=$12 RETURNING *`,
      [project_id, quote_number, version, status, valid_until, subtotal, gst, total, notes, terms, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Quote not found' });
    // Update quote items: delete old, insert new
    await pool.query('DELETE FROM quote_items WHERE quote_id = $1', [req.params.id]);
    if (Array.isArray(items)) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO quote_items (quote_id, description, category, quantity, unit, unit_price, total_price, material_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [req.params.id, item.description, item.category, item.quantity, item.unit, item.unit_price, item.total_price, item.material_id]
        );
      }
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

app.delete('/api/quotes/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM quote_items WHERE quote_id = $1', [req.params.id]);
    const result = await pool.query('DELETE FROM quotes WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Quote not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

// --- BUSINESS PROFILE (all require authentication) ---
app.get('/api/business-profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM business_profiles WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.json(null);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch business profile' });
  }
});

app.put('/api/business-profile', authenticateToken, async (req, res) => {
  const profile = req.body;
  try {
    // Check if profile exists
    const existing = await pool.query('SELECT id FROM business_profiles WHERE user_id = $1', [req.user.id]);
    if (existing.rows.length === 0) {
      // Insert new
      const result = await pool.query(
        `INSERT INTO business_profiles (user_id, company_name, abn, contact_person, email, phone, address, city, state, postcode, logo, markup, gst_rate, labor_rate, business_hours, service_areas)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
        [req.user.id, profile.company_name, profile.abn, profile.contact_person, profile.email, profile.phone, profile.address, profile.city, profile.state, profile.postcode, profile.logo, profile.markup, profile.gst_rate, profile.labor_rate, profile.business_hours, profile.service_areas]
      );
      res.json(result.rows[0]);
    } else {
      // Update existing
      const result = await pool.query(
        `UPDATE business_profiles SET company_name=$1, abn=$2, contact_person=$3, email=$4, phone=$5, address=$6, city=$7, state=$8, postcode=$9, logo=$10, markup=$11, gst_rate=$12, labor_rate=$13, business_hours=$14, service_areas=$15
         WHERE user_id=$16 RETURNING *`,
        [profile.company_name, profile.abn, profile.contact_person, profile.email, profile.phone, profile.address, profile.city, profile.state, profile.postcode, profile.logo, profile.markup, profile.gst_rate, profile.labor_rate, profile.business_hours, profile.service_areas, req.user.id]
      );
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update business profile' });
  }
});

// TODO: Auth, Users, Projects, Customers, Quotes, Materials, BusinessProfile endpoints

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
