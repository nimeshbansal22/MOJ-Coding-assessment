package uk.gov.hmcts.tasks.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.hmcts.tasks.dto.CreateTaskRequest;
import uk.gov.hmcts.tasks.dto.UpdateStatusRequest;
import uk.gov.hmcts.tasks.exception.TaskNotFoundException;
import uk.gov.hmcts.tasks.model.Task;
import uk.gov.hmcts.tasks.repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = Task.builder()
                .id(1L)
                .title("Review case file")
                .description("Review and summarise the case documents")
                .status("TODO")
                .dueDate(LocalDateTime.now().plusDays(3))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getAllTasks_returnsAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask));

        List<Task> result = taskService.getAllTasks();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Review case file");
        verify(taskRepository).findAll();
    }

    @Test
    void getAllTasks_returnsEmptyListWhenNoTasks() {
        when(taskRepository.findAll()).thenReturn(List.of());

        List<Task> result = taskService.getAllTasks();

        assertThat(result).isEmpty();
    }

    @Test
    void getTaskById_returnsTaskWhenFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        Task result = taskService.getTaskById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Review case file");
    }

    @Test
    void getTaskById_throwsTaskNotFoundExceptionWhenMissing() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createTask_savesAndReturnsTask() {
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("New task");
        request.setDescription("A description");
        request.setStatus("TODO");
        request.setDueDate(LocalDateTime.now().plusDays(1));

        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        Task result = taskService.createTask(request);

        assertThat(result).isNotNull();
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void updateTaskStatus_updatesAndReturnsTask() {
        UpdateStatusRequest request = new UpdateStatusRequest();
        request.setStatus("IN_PROGRESS");

        Task updated = Task.builder()
                .id(1L)
                .title("Review case file")
                .status("IN_PROGRESS")
                .dueDate(sampleTask.getDueDate())
                .createdAt(sampleTask.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(updated);

        Task result = taskService.updateTaskStatus(1L, request);

        assertThat(result.getStatus()).isEqualTo("IN_PROGRESS");
    }

    @Test
    void updateTaskStatus_throwsTaskNotFoundExceptionWhenMissing() {
        UpdateStatusRequest request = new UpdateStatusRequest();
        request.setStatus("DONE");

        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTaskStatus(99L, request))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void deleteTask_deletesSuccessfully() {
        when(taskRepository.existsById(1L)).thenReturn(true);

        taskService.deleteTask(1L);

        verify(taskRepository).deleteById(1L);
    }

    @Test
    void deleteTask_throwsTaskNotFoundExceptionWhenMissing() {
        when(taskRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.deleteTask(99L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("99");
    }
}
