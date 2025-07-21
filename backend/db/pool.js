
// importing the Pool class from the pg module, connection for bode.js to postgres
const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });  // explicitly load .env in backend root

//console.log('PG_HOST:', process.env.PG_HOST);
//console.log('PG_USER:', process.env.PG_USER);
//console.log('PG_PASSWORD:', process.env.PG_PASSWORD);
//console.log('PG_DATABASE:', process.env.PG_DATABASE);
//console.log('PG_PORT:', process.env.PG_PORT);

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: Number(process.env.PG_PORT),
});

module.exports = pool;
