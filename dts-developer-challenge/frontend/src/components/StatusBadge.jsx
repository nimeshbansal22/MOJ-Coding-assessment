export default function StatusBadge({ status }) {
  let badgeClass = 'badge-default';
  let label = status;

  if (status === 'TODO') {
    badgeClass = 'badge-todo';
    label = 'To Do';
  } else if (status === 'IN_PROGRESS') {
    badgeClass = 'badge-inprogress';
    label = 'In Progress';
  } else if (status === 'DONE') {
    badgeClass = 'badge-done';
    label = 'Done';
  }

  return <span className={`badge ${badgeClass}`}>{label}</span>;
}
