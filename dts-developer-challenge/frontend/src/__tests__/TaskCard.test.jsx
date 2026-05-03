import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import TaskCard from '../components/TaskCard'

describe('TaskCard', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test description',
    status: 'TODO',
    dueDate: '2026-12-01T10:00:00'
  }

  it('renders task details correctly', () => {
    render(<TaskCard task={mockTask} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getAllByText('To Do').length).toBeGreaterThan(0)
  })

  it('calls onStatusChange when status is updated', () => {
    const onStatusChange = vi.fn()
    render(<TaskCard task={mockTask} onStatusChange={onStatusChange} onDelete={vi.fn()} />)
    
    const select = screen.getByDisplayValue('To Do')
    fireEvent.change(select, { target: { value: 'DONE' } })
    
    expect(onStatusChange).toHaveBeenCalledWith(1, 'DONE')
  })

  it('calls onDelete when delete button clicking confirmed', () => {
    const onDelete = vi.fn()
    window.confirm = vi.fn(() => true) // Mock confirm to true
    
    render(<TaskCard task={mockTask} onStatusChange={vi.fn()} onDelete={onDelete} />)
    
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }))
    
    expect(window.confirm).toHaveBeenCalled()
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})
