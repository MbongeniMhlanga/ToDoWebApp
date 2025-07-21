
// Importing the postgressql connection pool from the db/pool module
const pool = require('../db/pool');


//Handles GET requests to retrieve all to-do items from the database
exports.getTodos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todo_list');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Handles POST requests to send a to-do to the database
exports.addTodo = async (req, res) => {
  const { monday, tuesday, wednesday, thursday, friday } = req.body;
  const query = `
    INSERT INTO todo_list (monday, tuesday, wednesday, thursday, friday)
    VALUES ($1, $2, $3, $4, $5) RETURNING id
  `;
  try {
    const result = await pool.query(query, [monday, tuesday, wednesday, thursday, friday]);
    res.status(201).json({ message: 'To-do added', insertId: result.rows[0].id });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ message: 'Insert error' });
  }
};

//Handles PUT requests to update a to-do in the database
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { monday, tuesday, wednesday, thursday, friday } = req.body;
  const query = `
    UPDATE todo_list
    SET monday=$1, tuesday=$2, wednesday=$3, thursday=$4, friday=$5
    WHERE id=$6
  `;
  try {
    await pool.query(query, [monday, tuesday, wednesday, thursday, friday, id]);
    res.json({ message: 'To-do updated' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Update error' });
  }
};
//Handles DELETE requests to remove a to-do from the database
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todo_list WHERE id = $1', [id]);
    res.json({ message: 'To-do deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Delete error' });
  }
};
// Add this controller function for PATCH updating only status
exports.updateTodoStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE todo_list SET status=$1 WHERE id=$2', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Update status error' });
  }
};
