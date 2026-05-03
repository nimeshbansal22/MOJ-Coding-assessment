import TaskCard from './TaskCard'

export default function TaskList({ tasks, onStatusChange, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create one to get started!</p>
      </div>
    )
  }

  // Group tasks by status or just list them. Listing them sorted by due date is simple and effective.
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="task-list">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
