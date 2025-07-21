import React, { useState } from "react";

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    display: 'inline-block',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 5,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 5,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer',
    width: '100%',
  },
  taskList: {
    marginTop: 20,
  },
  taskItem: {
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: 16,
    marginBottom: 8,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
  }
};

function AddTodo() {
  const [taskInput, setTaskInput] = useState("");
  const [dayInput, setDayInput] = useState("Monday");
  const [tasks, setTasks] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [message, setMessage] = useState("");

  const handleAddDayTask = () => {
    if (!taskInput.trim()) {
      alert("Task cannot be empty.");  // Alert here
      return;
    }

    if (editingDay) {
      setTasks((prev) => ({ ...prev, [editingDay]: taskInput }));
      alert(`Updated task for ${editingDay}.`); // Alert here
      setEditingDay(null);
    } else {
      if (tasks[dayInput]) {
        alert(`${dayInput} already has a task! Click on it to edit.`); // Alert here
        return;
      }
      setTasks((prev) => ({ ...prev, [dayInput]: taskInput }));
      alert(`${dayInput} task added.`); // Alert here
    }

    setTaskInput("");
  };

  const handleSubmit = async () => {
    if (Object.keys(tasks).length < 5) {
      alert("Please enter a task for all 5 weekdays.");  // Alert here
      return;
    }

    const payload = {
      monday: tasks["Monday"] || "",
      tuesday: tasks["Tuesday"] || "",
      wednesday: tasks["Wednesday"] || "",
      thursday: tasks["Thursday"] || "",
      friday: tasks["Friday"] || "",
    };

    try {
      const res = await fetch("http://localhost:2001/todo_list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Tasks added successfully!");  // Alert here
        setTasks({});
        setMessage("");
        setTaskInput("");
        setEditingDay(null);
      } else {
        const result = await res.json();
        alert(result.message || "Error saving tasks");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New To-Do</h2>

      <div style={{ marginBottom: 15 }}>
        <label style={styles.label}>Day: </label>
        <select
          value={dayInput}
          onChange={(e) => setDayInput(e.target.value)}
          style={styles.select}
        >
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
            <option key={day}>{day}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={styles.label}>Task: </label>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          style={styles.input}
        />
      </div>

      <button
        onClick={handleAddDayTask}
        disabled={!taskInput.trim()}
        style={styles.button}
      >
        {editingDay ? `Update ${editingDay}` : "Add Task"}
      </button>

      {Object.entries(tasks).length > 0 && (
        <div style={styles.taskList}>
          <h4>Selected Tasks:</h4>
          <ul style={{ paddingLeft: 0 }}>
            {Object.entries(tasks).map(([day, task]) => (
              <li
                key={day}
                style={styles.taskItem}
                onClick={() => {
                  setEditingDay(day);
                  setTaskInput(task);
                  setDayInput(day);
                  setMessage(`Editing task for ${day}`);
                }}
              >
                <strong>{day}:</strong> {task}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSubmit} style={styles.button}>
        Submit All Tasks
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

export default AddTodo;
