import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import TaskForm from '../components/TaskForm'
import { createTask } from '../api/tasksApi'

vi.mock('../api/tasksApi')

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<TaskForm onCreated={vi.fn()} onError={vi.fn()} />)
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<TaskForm onCreated={vi.fn()} onError={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }))
    
    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(await screen.findByText('Due date is required')).toBeInTheDocument()
    expect(createTask).not.toHaveBeenCalled()
  })

  it('submits form when valid', async () => {
    createTask.mockResolvedValue({ id: 1, title: 'Test Task' })
    const onCreated = vi.fn()
    
    render(<TaskForm onCreated={onCreated} onError={vi.fn()} />)
    
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Task' } })
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: '2026-10-10T10:00' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }))
    
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Task',
        description: null,
        status: 'TODO',
        dueDate: expect.any(String)
      }))
      expect(onCreated).toHaveBeenCalledWith({ id: 1, title: 'Test Task' })
    })
  })
})
