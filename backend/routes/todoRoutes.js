/**Importing required modules */
const express = require('express');
const router = express.Router();// Creating a new router instance
const controller = require('../controllers/todoControllers');// Importing controller functions


// Setting up route handlers for CRUD operations on the to-do list
router.get('/todo_list', controller.getTodos);         // Retrieve all to-do items
router.post('/todo_list', controller.addTodo);         // Add a new to-do item
router.put('/todo_list/:id', controller.updateTodo);   // Update an existing to-do item by ID
router.delete('/todo_list/:id', controller.deleteTodo); // Delete a to-do item by ID
router.patch('/todo_list/:id', controller.updateTodoStatus);


module.exports = router;
