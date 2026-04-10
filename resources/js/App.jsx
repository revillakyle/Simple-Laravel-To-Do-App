import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, is_done: false })
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setFormData({ title: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, is_done: !task.is_done })
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updated = await response.json();
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Tasks</h1>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleCreateTask} style={styles.form}>
        <input
          type="text"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Task description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={styles.input}
        />
        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {loading ? (
        <p style={styles.loading}>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={styles.empty}>No tasks yet. Create one above!</p>
      ) : (
        <ul style={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} style={{ ...styles.taskItem, opacity: task.is_done ? 0.6 : 1 }}>
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => handleToggleTask(task)}
                style={styles.checkbox}
              />
              <div style={styles.taskContent}>
                <h3 style={{ ...styles.taskTitle, textDecoration: task.is_done ? 'line-through' : 'none' }}>
                  {task.title}
                </h3>
                {task.description && <p style={styles.taskDesc}>{task.description}</p>}
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: '1.5',
  },
  title: {
    fontSize: '28px',
    marginBottom: '24px',
    color: '#333',
  },
  error: {
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '4px',
    border: '1px solid #fcc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
  },
  button: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  taskItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #ddd',
    transition: 'background-color 0.2s',
  },
  checkbox: {
    marginTop: '4px',
    cursor: 'pointer',
    width: '18px',
    height: '18px',
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
  },
  taskDesc: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
  },
  deleteBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: '#f5f5f5',
    color: '#d32f2f',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
};
