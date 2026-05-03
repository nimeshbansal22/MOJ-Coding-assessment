import { useState, useEffect, useCallback } from 'react'
import { fetchAllTasks, deleteTask, updateTaskStatus } from './api/tasksApi'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAllTasks()
      setTasks(data)
    } catch {
      setError('Could not load tasks. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleTaskCreated = (task) => {
    setTasks((prev) => [task, ...prev])
    setShowForm(false)
    showSuccess('Task created successfully!')
  }

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateTaskStatus(id, status)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      showSuccess('Status updated!')
    } catch {
      setError('Failed to update task status.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      showSuccess('Task deleted.')
    } catch {
      setError('Failed to delete task.')
    }
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const todoCount = tasks.filter((t) => t.status === 'TODO').length
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const doneCount = tasks.filter((t) => t.status === 'DONE').length

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">
              <span className="logo-crown">♛</span>
            </div>
            <div>
              <span className="header-org">HM Courts &amp; Tribunals Service</span>
              <h1 className="header-title">Task Manager</h1>
            </div>
          </div>
          <button
            id="open-task-form-btn"
            className="btn btn-primary"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {successMsg && (
          <div className="alert alert-success" role="status">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
            <button className="alert-close" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {showForm && (
          <div className="form-panel">
            <h2 className="section-title">Create New Task</h2>
            <TaskForm onCreated={handleTaskCreated} onError={setError} />
          </div>
        )}

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item stat-todo">
            <span className="stat-number">{todoCount}</span>
            <span className="stat-label">To Do</span>
          </div>
          <div className="stat-item stat-inprogress">
            <span className="stat-number">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-item stat-done">
            <span className="stat-number">{doneCount}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading tasks…</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>HMCTS Task Manager · DTS Developer Challenge</p>
      </footer>
    </div>
  )
}
