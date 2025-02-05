package backend.urgentcare.repository;

import backend.urgentcare.domain.UrgentCare;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UrgentCareRepository extends JpaRepository<UrgentCare, Long> {
}
