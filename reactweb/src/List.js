import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function List() {
  // Declaring variables
  const [taskInput, setTaskInput] = useState("");
  const [dayInput, setDayInput] = useState("Monday");
  const [tasks, setTasks] = useState({});
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editingDay, setEditingDay] = useState(null); // Track if we're editing a day-task
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // For showing one todo at a time

  // Load to-do items from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:2001/todo_list");
      const data = await res.json();
      setTodos(data);
      if (data.length > 0) setCurrentIndex(0); // Reset to first todo when list updates
      return data;
    } catch (err) {
      console.error("Error fetching todos:", err);
      setMessage("Could not load todos.");
      return [];
    }
  };

  // Handle adding or updating task for a day
  const handleAddDayTask = () => {
    if (!taskInput.trim()) {
      setMessage("Task cannot be empty.");
      return;
    }

    if (editingDay) {
      setTasks((prev) => ({ ...prev, [editingDay]: taskInput }));
      setMessage(`Updated task for ${editingDay}.`);
      setEditingDay(null);
    } else {
      if (tasks[dayInput]) {
        setMessage(`${dayInput} already has a task! Click on it to edit.`);
        return;
      }
      setTasks((prev) => ({ ...prev, [dayInput]: taskInput }));
      setMessage(`${dayInput} task added.`);
    }

    setTaskInput("");
  };

  // Submit all tasks to backend
  const handleSubmit = async () => {
    if (Object.keys(tasks).length < 5) {
      setMessage("Please enter a task for all 5 weekdays.");
      return;
    }

    const payload = {
      monday: tasks["Monday"] || "",
      tuesday: tasks["Tuesday"] || "",
      wednesday: tasks["Wednesday"] || "",
      thursday: tasks["Thursday"] || "",
      friday: tasks["Friday"] || "",
    };

    const url = editId
      ? `http://localhost:2001/todo_list/${editId}`
      : "http://localhost:2001/todo_list";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(editId ? "Updated!" : "Added!");
        resetForm();

        await fetchTodos();
      } else {
        setMessage(result.message || "Error saving data");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("Server error");
    }
  };

  // Edit full record
const navigate = useNavigate();

const handleEdit = (todo) => {
  console.log("Navigating to update with todo:", todo);
  navigate(`/update/${todo.id}`, {
    state: {
      todo, // pass the full todo data
    },
  });
};

  // Delete a record
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:2001/todo_list/${id}`, { method: "DELETE" });
      setMessage("Deleted");
      await fetchTodos();
      // Adjust currentIndex if needed
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      setMessage("Delete failed");
    }
  };

  // Reset form
  const resetForm = () => {
    setEditId(null);
    setTasks({});
    setTaskInput("");
    setDayInput("Monday");
    setEditingDay(null);
    setMessage("");
  };

  // Navigate between todos
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < todos.length - 1 ? prev + 1 : prev));
  };

  // Current todo to display
  const currentTodo = todos[currentIndex];

  return (
    <div style={containerStyle}>
      <h2>To-Do List</h2>

      {/* Day Dropdown */}
      <div style={rowStyle}>
        <label>Day:</label>
        <select value={dayInput} onChange={(e) => setDayInput(e.target.value)}>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
        </select>
      </div>

      {/* Task Input */}
      <div style={rowStyle}>
        <label>Task:</label>
        <input value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
      </div>

      {/* Add or Update Day Task */}
      <button style={buttonStyle} onClick={handleAddDayTask} disabled={!taskInput.trim()}>
        {editingDay ? `Update ${editingDay}` : "Add Task"}
      </button>

      {/* Selected Day Tasks */}
      {Object.entries(tasks).length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <h4>Selected Tasks:</h4>
          <ul>
            {Object.entries(tasks).map(([day, task]) => (
              <li key={day}>
                <strong
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => {
                    setEditingDay(day);
                    setTaskInput(task);
                    setDayInput(day);
                    setMessage(`Editing task for ${day}`);
                  }}
                >
                  {day}:
                </strong>{" "}
                {task}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Final Submit Button */}
      <button
        style={{ ...buttonStyle, backgroundColor: "#007bff", marginTop: "10px" }}
        onClick={handleSubmit}
      >
        {editId ? "Update Set" : "Submit All"}
      </button>

      {/* Message */}
      {message && <p>{message}</p>}

      {/* Display One Saved Task at a Time */}
      <h3 style={{ marginTop: "30px" }}>Saved Task {todos.length > 0 ? `${currentIndex + 1} / ${todos.length}` : ""}</h3>
      {currentTodo ? (
        <div style={{ ...rowStyle, flexDirection: "column", alignItems: "flex-start" }}>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) =>
            currentTodo[day.toLowerCase()] ? (
              <p key={day}>
                <strong>{day}:</strong> {currentTodo[day.toLowerCase()]}
              </p>
            ) : null
          )}
          <div>
            <button onClick={() => handleEdit(currentTodo)} style={{ marginRight: "10px" }}>
              Edit
            </button>
            <button onClick={() => handleDelete(currentTodo.id)}>Delete</button>
          </div>
        </div>
      ) : (
        <p>No saved tasks.</p>
      )}

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "15px" }}>
        <button onClick={handlePrev} disabled={currentIndex === 0} style={paginationButtonStyle}>
          Previous
        </button>
        <button onClick={handleNext} disabled={currentIndex === todos.length - 1 || todos.length === 0} style={paginationButtonStyle}>
          Next
        </button>
      </div>
    </div>
  );
}

export default List;

// Styling
const containerStyle = {
  backgroundColor: "#F0F8FF",
  color: "#333",
  padding: "30px",
  borderRadius: "10px",
  maxWidth: "500px",
  margin: "auto",
};

const rowStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginBottom: "15px",
  justifyContent: "space-between",
};

const buttonStyle = {
  backgroundColor: "#28a745",
  padding: "12px 25px",
  borderRadius: "5px",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
};

const paginationButtonStyle = {
  backgroundColor: "#007bff",
  padding: "10px 20px",
  borderRadius: "5px",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  disabled: {
    opacity: 0.5,
    cursor: "default",
  },
};
