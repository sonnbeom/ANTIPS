package backend.emergency.repository;

import backend.emergency.domain.Emergency;
import backend.emergency.domain.QEmergency;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static backend.emergency.domain.QEmergency.*;

@Repository

public class CustomEmergencyRepository{

    private final JPAQueryFactory queryFactory;
    @Autowired
    public CustomEmergencyRepository(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    public List<Emergency> findActiveEmergency() {
        return queryFactory.selectFrom(emergency)
                .where(emergency.active.eq(true))
                .orderBy(emergency.createdAt.desc())
                .fetch();
    }
}
