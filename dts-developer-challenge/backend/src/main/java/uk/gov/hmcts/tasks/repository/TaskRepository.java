package uk.gov.hmcts.tasks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.hmcts.tasks.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
