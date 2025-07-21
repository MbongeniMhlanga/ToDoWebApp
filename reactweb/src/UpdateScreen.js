import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const UpdateScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedTodo = location.state?.todo;

  const [tasks, setTasks] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (passedTodo) {
      // Prefill from passed todo state
      setTasks({
        Monday: passedTodo.monday || '',
        Tuesday: passedTodo.tuesday || '',
        Wednesday: passedTodo.wednesday || '',
        Thursday: passedTodo.thursday || '',
        Friday: passedTodo.friday || '',
      });
      setLoading(false);
    } else {
      // Fetch from backend if no passed todo
      const fetchTodo = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:2001/todo_list/${id}`);
          const data = response.data;
          setTasks({
            Monday: data.monday || '',
            Tuesday: data.tuesday || '',
            Wednesday: data.wednesday || '',
            Thursday: data.thursday || '',
            Friday: data.friday || '',
          });
          setError('');
        } catch (err) {
          setError('Failed to fetch todo');
        } finally {
          setLoading(false);
        }
      };
      fetchTodo();
    }
  }, [id, passedTodo]);

  const handleChange = (day, value) => {
    setTasks((prev) => ({ ...prev, [day]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !tasks.Monday.trim() ||
      !tasks.Tuesday.trim() ||
      !tasks.Wednesday.trim() ||
      !tasks.Thursday.trim() ||
      !tasks.Friday.trim()
    ) {
      setMessage('Please fill in all weekdays');
      return;
    }

    setMessage('');
    try {
      await axios.put(`http://localhost:2001/todo_list/${id}`, {
        monday: tasks.Monday,
        tuesday: tasks.Tuesday,
        wednesday: tasks.Wednesday,
        thursday: tasks.Thursday,
        friday: tasks.Friday,
      });

      setMessage('Updated successfully! Redirecting...');
      alert('Record updated successfully!');  // Alert for success
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage('Update failed. Please try again.');
      alert('Failed to update the record.');  // Alert for failure
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Update To-Do</h2>
      <form onSubmit={handleUpdate} style={styles.form}>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
          <div key={day} style={styles.inputGroup}>
            <label htmlFor={day} style={styles.label}>{day}</label>
            <input
              id={day}
              type="text"
              value={tasks[day]}
              onChange={(e) => handleChange(day, e.target.value)}
              style={styles.input}
              required
            />
          </div>
        ))}
        <button type="submit" style={styles.button}>Update</button>
      </form>
      {message && (
        <p
          style={{
            marginTop: '15px',
            textAlign: 'center',
            color: message.toLowerCase().includes('fail') ? 'red' : 'green',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '450px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    marginTop: '20px',
  },
  inputGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default UpdateScreen;
