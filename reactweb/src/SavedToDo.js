import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const normalizeStatus = (status) => {
  if (status === "C") return "Completed";
  if (status === "I") return "In Progress";
  if (status === "N") return "Not Started";
  return status; // assume already full form
};

const SavedToDo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:2001/todo_list");
      const data = await res.json();
      const normalizedData = data.map(todo => ({
        ...todo,
        status: normalizeStatus(todo.status),
      }));
      setTodos(normalizedData.reverse());
      setError("");
      setCurrentIndex(0);
    } catch (err) {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleEdit = (todo) => {
    navigate(`/update/${todo.id}`, { state: { todo } });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:2001/todo_list/${id}`, { method: "DELETE" });
      await fetchTodos();
      setCurrentIndex(prev => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      alert("Failed to delete todo");
    }
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < todos.length - 1 ? prev + 1 : prev));
  };

  const handleStatusChange = async (e) => {
    const updatedStatus = e.target.value;
    setUpdatingStatus(true);
    const currentTodo = todos[currentIndex];

    try {
      await fetch(`http://localhost:2001/todo_list/${currentTodo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });
      await fetchTodos();
      alert("✅ Status updated successfully!");
    } catch (err) {
      alert("❌ Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <p>Loading saved todos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const currentTodo = todos[currentIndex];
  const isCompleted = currentTodo.status === "Completed";

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📌 Saved ToDos</h1>

      {todos.length === 0 ? (
        <p>No saved todos found.</p>
      ) : (
        <>
          <h2 style={styles.subtitle}>
            Task {todos.length - currentIndex} of {todos.length}
          </h2>

          <div style={styles.flexWrapper}>
            {/* Main Task Info */}
            <div style={styles.card}>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day =>
                currentTodo[day.toLowerCase()] ? (
                  <p key={day}>
                    <strong>{day}:</strong> {currentTodo[day.toLowerCase()]}
                  </p>
                ) : null
              )}

              <div style={{ marginTop: 15 }}>
                <button
                  onClick={() => handleEdit(currentTodo)}
                  disabled={isCompleted}
                  style={{
                    ...styles.editButton,
                    opacity: isCompleted ? 0.5 : 1,
                    cursor: isCompleted ? "not-allowed" : "pointer",
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(currentTodo.id)}
                  disabled={isCompleted}
                  style={{
                    ...styles.deleteButton,
                    opacity: isCompleted ? 0.5 : 1,
                    cursor: isCompleted ? "not-allowed" : "pointer",
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Status Section */}
            <div style={styles.statusCard}>
              <h4 style={{ marginBottom: 10 }}>📍 Current Status</h4>
              <p style={{ fontWeight: "bold", marginBottom: 15 }}>
                {currentTodo.status || "Not Started"}
              </p>
              <select
                value={currentTodo.status || "Not Started"}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                style={styles.select}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={styles.pagination}>
            <button onClick={handlePrev} disabled={currentIndex === 0} style={styles.navButton}>
              ⬅️ Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === todos.length - 1}
              style={styles.navButton}
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedToDo;

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#007bff",
  },
  subtitle: {
    fontSize: "20px",
    marginBottom: 10,
    textAlign: "center",
    color: "#444",
  },
  flexWrapper: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    padding: 20,
    lineHeight: 1.6,
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    minWidth: "250px",
  },
  statusCard: {
    width: "220px",
    backgroundColor: "#fff8e1",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#000",
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    marginRight: 10,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  pagination: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-between",
  },
  navButton: {
    backgroundColor: "#007bff",
    padding: "10px 25px",
    borderRadius: 10,
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
