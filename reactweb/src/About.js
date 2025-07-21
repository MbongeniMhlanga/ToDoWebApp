import React, { useState, useEffect, useRef } from "react";

function About() {
  // Declaring variables
  const [taskInput, setTaskInput] = useState("");
  const [dayInput, setDayInput] = useState("Monday");
  const [tasks, setTasks] = useState({});
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editingDay, setEditingDay] = useState(null); // Track if we're editing a day-task
  const [message, setMessage] = useState("");

  // Ref for last todo item to scroll into view
  const lastTodoRef = useRef(null);

  // Load to-do items from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:2001/todo_list");
      const data = await res.json();
      setTodos(data);
      return data; // Return for caller to wait on it
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

        // Wait for todos to update
        await fetchTodos();

        // Scroll last todo into view smoothly
        if (lastTodoRef.current) {
          lastTodoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        setMessage(result.message || "Error saving data");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("Server error");
    }
  };

  // Edit full record
  const handleEdit = (todo) => {
    setEditId(todo.id);
    setTasks({
      Monday: todo.monday,
      Tuesday: todo.tuesday,
      Wednesday: todo.wednesday,
      Thursday: todo.thursday,
      Friday: todo.friday,
    });
    setMessage("Editing this task set.");

    // Scroll smoothly to top when edit starts
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a record
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:2001/todo_list/${id}`, { method: "DELETE" });
      setMessage("Deleted");
      fetchTodos();
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
        {editingDay ? `Update ${editingDay}` : "Add Day Task"}
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

      {/* Display Saved Records */}
      <h3 style={{ marginTop: "30px" }}>Saved Tasks:</h3>
      {todos.map((todo, index) => {
        const isLast = index === todos.length - 1;
        return (
          <div
            key={todo.id}
            ref={isLast ? lastTodoRef : null}
            style={{ ...rowStyle, flexDirection: "column", alignItems: "flex-start" }}
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) =>
              todo[day.toLowerCase()] ? (
                <p key={day}>
                  <strong>{day}:</strong> {todo[day.toLowerCase()]}
                </p>
              ) : null
            )}
            <div>
              <button onClick={() => handleEdit(todo)} style={{ marginRight: "10px" }}>
                Edit
              </button>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default About;

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
