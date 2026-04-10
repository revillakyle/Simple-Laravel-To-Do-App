import { useState, useEffect } from 'react'

const API = 'http://127.0.0.1:8000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch all tasks
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => { setTasks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Create a task
  const addTask = () => {
    if (!title.trim()) return
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ title, description })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask])
        setTitle('')
        setDescription('')
      })
  }

  // Toggle done (strikethrough) via PUT
  const toggleDone = (task) => {
  fetch(`${API}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ is_done: !task.is_done }) // ← is_done not is_done
  })
    .then(res => res.json())
    .then(updated => {
      setTasks(tasks.map(t => t.id === updated.id ? updated : t))
    })
}

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h1>📝 Notes</h1>

      {/* Add Task Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <input
          placeholder="Title *"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <input
          placeholder="Description (NON OPTIONAL)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <button onClick={addTask} style={{ padding: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Add Task
        </button>
      </div>

      {/* Task List */}
      {loading && <p>Loading...</p>}
      {!loading && tasks.length === 0 && <p>No tasks yet. Add one above!</p>}

      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tasks.map(task => (
          <li key={task.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
            background: task.is_done ? '#f9f9f9' : '#fff'
          }}>
            <div>
              <div style={{
                fontWeight: 'bold', fontSize: '16px',
                textDecoration: task.is_done ? 'line-through' : 'none',
                color: task.is_done ? '#aaa' : '#000'
              }}>
                {task.title}
              </div>
              {task.description && (
                <div style={{
                  fontSize: '13px', color: '#888',
                  textDecoration: task.is_done ? 'line-through' : 'none'
                }}>
                  {task.description}
                </div>
              )}
            </div>

            <button onClick={() => toggleDone(task)} style={{ cursor: 'pointer' }}>
              {task.is_done ? '↩ Undo' : '✓ Done'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App