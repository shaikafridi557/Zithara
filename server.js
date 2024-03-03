const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { Pool } = require('pg');

const app = express();
const port = 5000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'customerss', 
    password: 'Mypassword@987',
    port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.post('/api/insertDummyData', async (req, res) => {
    try {
      const dummyData = [];
      for (let i = 1; i <= 50; i++) {
        dummyData.push([i, `Customer ${i}`, 30 + i, `123456789${i}`, `Location ${i}`, new Date()]);
      }
      const query = `INSERT INTO customers (sno, customer_name, age, phone, location, created_at) VALUES ${dummyData.map((_, index) => `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${index * 6 + 6})`).join(',')}`;
      await pool.query(query, dummyData.flat());
      res.status(200).send('Dummy data inserted successfully');
    } catch (error) {
      console.error('Error inserting dummy data:', error);
      res.status(500).send('Internal Server Error');
    }
});

app.get('/api/customers', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        const sortOrder = req.query.sortOrder || 'ASC';
        const search = req.query.search || '';
    
        let query = `
            SELECT * 
            FROM customers 
            WHERE customer_name ILIKE $1 OR location ILIKE $2 
            ORDER BY created_at ${sortOrder}
            LIMIT $3 OFFSET $4`;
        let params = [`%${search}%`, `%${search}%`, limit, offset];
        
        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
