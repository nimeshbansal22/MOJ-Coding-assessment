import StatusBadge from './StatusBadge'

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const formattedDate = new Date(task.dueDate).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-card-title">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>

      <div className="task-card-body">
        {task.description && (
          <p className="task-card-desc">{task.description}</p>
        )}
        <p className="task-card-due">
          <strong>Due:</strong> {formattedDate}
        </p>
      </div>

      <div className="task-card-actions">
        <div>
          <label htmlFor={`status-select-${task.id}`} className="sr-only">Update Status</label>
          <select
            id={`status-select-${task.id}`}
            className="form-input form-select form-select-sm"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDelete(task.id)
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
