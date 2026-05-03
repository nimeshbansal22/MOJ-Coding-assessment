const BASE_URL = '/api/tasks'

export async function fetchAllTasks() {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function fetchTaskById(id) {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch task ${id}`)
  return res.json()
}

export async function createTask(taskData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  })
  if (!res.ok) {
    const err = await res.json()
    throw { status: res.status, data: err }
  }
  return res.json()
}

export async function updateTaskStatus(id, status) {
  const res = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw { status: res.status, data: err }
  }
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Failed to delete task ${id}`)
}
