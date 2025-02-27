package backend.fcm.repository;

import backend.fcm.domain.Fcm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FcmTokenRepository extends JpaRepository<Fcm, Long> {
    Optional<Fcm> findByToken(String token);

    @Override
    List<Fcm> findAll();
}
