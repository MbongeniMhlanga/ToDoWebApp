const express = require('express');
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todoRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', todoRoutes);


console.log('Current working directory:', process.cwd());
console.log('App folder:', __dirname);

// Optional: fallback route
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;
