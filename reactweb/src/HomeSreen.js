import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);

  // Status mapping: short code ↔ full label
  const mapStatus = (code) => {
    switch (code) {
      case 'c': return 'complete';
      case 'i': return 'in progress';
      case 'n': return 'not started';
      default: return 'not started';
    }
  };

  const mapStatusToCode = (status) => {
    switch (status) {
      case 'complete': return 'c';
      case 'in progress': return 'i';
      case 'not started': return 'n';
      default: return 'n';
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("http://localhost:2001/todo_list");
        if (!res.ok) throw new Error("Failed to fetch todos");
        const data = await res.json();
        setTodos(data);
        setError("");
      } catch (err) {
        setError("Could not load todos");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const updateStatus = async (todoId, newStatus) => {
    try {
      const statusCode = mapStatusToCode(newStatus);

      // Optimistic UI update
      setTodos(prev =>
        prev.map(todo => (todo.id === todoId ? { ...todo, status: statusCode } : todo))
      );

      const res = await fetch(`http://localhost:2001/todo_list/${todoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusCode }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      alert("✅ Status updated successfully");
    } catch (err) {
      setError("Error updating status");
    }
  };

  const completed = todos.filter(t => mapStatus(t.status) === "complete").length;
  const total = todos.length;
  const pending = total - completed;

  const formatDate = (dateStr) => {
    if (!dateStr) return "No date";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  // Sort todos oldest to newest (Week 1 = oldest)
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const closeModal = () => setSelectedTodo(null);

  if (loading) return <p>Loading todos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Dashboard Overview</h1>

      <div style={styles.summaryCards}>
        <div style={styles.card}>
          <span>Total Todos:</span> <strong>{total}</strong>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#4caf50', color: 'white' }}>
          <span>Completed:</span> <strong>{completed}</strong>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#f44336', color: 'white' }}>
          <span>Pending:</span> <strong>{pending}</strong>
        </div>
      </div>

      <h2 style={styles.subtitle}>📝 All Todos</h2>

      {sortedTodos.length === 0 ? (
        <p>No todos available. Add some!</p>
      ) : (
        <ul style={styles.list}>
          {sortedTodos.map((todo, index) => (
            <li
              key={todo.id || index}
              style={{ ...styles.listItem, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span
                style={{ cursor: 'pointer', color: '#007bff' }}
                onClick={() => setSelectedTodo(todo)}
                title="Click to view details"
              >
                📅 Week {index + 1} – {formatDate(todo.created_at)}
              </span>

              <select
                value={mapStatus(todo.status)}
                onChange={(e) => updateStatus(todo.id, e.target.value)}
                style={{ padding: '4px 8px', borderRadius: 5 }}
              >
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>
            </li>
          ))}
        </ul>
      )}

      <Link to="/add" style={styles.addButton}>➕ Add New Todo</Link>

      {selectedTodo && (
        <div style={styles.modalBackdrop} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Todo Details</h3>
            <p><strong>Created:</strong> {formatDate(selectedTodo.created_at)}</p>
            <p><strong>Status:</strong> {mapStatus(selectedTodo.status)}</p>
            <button style={styles.closeButton} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

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
  summaryCards: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 35,
    flexWrap: 'wrap',
    gap: '10px',
  },
  card: {
    flex: 1,
    minWidth: '30%',
    padding: '15px',
    borderRadius: 8,
    backgroundColor: '#eee',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: 15,
    borderBottom: '2px solid #ddd',
    paddingBottom: 5,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginBottom: 30,
    maxHeight: '400px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: 8,
  },
  listItem: {
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
    fontSize: '16px',
  },
  addButton: {
    display: 'block',
    width: '100%',
    padding: '14px',
    borderRadius: 8,
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '10px',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px 30px',
    borderRadius: 8,
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    textAlign: 'left',
  },
  closeButton: {
    marginTop: 20,
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#f44336',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
