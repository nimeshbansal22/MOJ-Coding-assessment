import { useState } from 'react'
import { createTask } from '../api/tasksApi'

const STATUSES = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
]

export default function TaskForm({ onCreated, onError }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('TODO')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!title.trim()) errs.title = 'Title is required'
    if (!dueDate) errs.dueDate = 'Due date is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})
    setSubmitting(true)
    try {
      const created = await createTask({
        title: title.trim(),
        description: description.trim() || null,
        status,
        dueDate: new Date(dueDate).toISOString().slice(0, 19),
      })
      onCreated(created)
      setTitle('')
      setDescription('')
      setStatus('TODO')
      setDueDate('')
    } catch (err) {
      if (err?.data?.fieldErrors) {
        setFieldErrors(err.data.fieldErrors)
      } else {
        onError('Failed to create task. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id="task-form" className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Title <span className="required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={`form-input ${fieldErrors.title ? 'input-error' : ''}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Review case file for Smith v Jones"
          maxLength={200}
        />
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Description <span className="optional">(optional)</span>
        </label>
        <textarea
          id="task-description"
          className="form-input form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any relevant details…"
          rows={3}
          maxLength={1000}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-status" className="form-label">
            Status <span className="required">*</span>
          </label>
          <select
            id="task-status"
            className="form-input form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-due-date" className="form-label">
            Due Date &amp; Time <span className="required">*</span>
          </label>
          <input
            id="task-due-date"
            type="datetime-local"
            className={`form-input ${fieldErrors.dueDate ? 'input-error' : ''}`}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {fieldErrors.dueDate && <span className="field-error">{fieldErrors.dueDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button
          id="submit-task-btn"
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Creating…' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
