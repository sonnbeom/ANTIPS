package backend.urgentcare.repository;

import backend.patient.domain.Patient;
import backend.urgentcare.domain.QUrgentCare;
import backend.urgentcare.domain.UrgentCare;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static backend.urgentcare.domain.QUrgentCare.*;

@Repository
public class CustomUrgentCareRepository {
    private final JPAQueryFactory queryFactory;

    @Autowired
    public CustomUrgentCareRepository(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    public List<UrgentCare> findUrgentCareListByParent(Patient patient) {

        return queryFactory
                .selectFrom(urgentCare)
                .where(urgentCare.patient.eq(patient))
                .orderBy(urgentCare.createdAt.desc())
                .fetch();
    }
}
