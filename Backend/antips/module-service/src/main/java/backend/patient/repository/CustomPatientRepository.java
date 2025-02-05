package backend.patient.repository;


import backend.patient.domain.Patient;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static backend.common.constant.ConstantSortKeyword.*;
import static backend.patient.domain.QPatient.*;

@Repository
public class CustomPatientRepository {
    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;
    @Autowired
    public CustomPatientRepository(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
        this.entityManager = entityManager;
    }
    public List<Patient> getPatientsBySort(String sort, String order, int floor){

        JPAQuery<Patient> query = queryFactory.selectFrom(patient)
                .where(patient.floor.eq(floor));
        switch (sort) {
            case CREATED_AT:
                if (ASC.equalsIgnoreCase(order)) {
                    query.orderBy(patient.admissionDate.asc());
                } else {
                    query.orderBy(patient.admissionDate.desc());
                }
                break;
            case URGENT_LEVEL:
                if (ASC.equalsIgnoreCase(order)) {
                    query.orderBy(patient.urgencyLevel.asc());
                } else {
                    query.orderBy(patient.urgencyLevel.desc());
                }
                break;
            case TO_DO:
                query.where(patient.status.eq(TO_DO));
                break;
            case DONE:
                query.where(patient.status.eq(DONE));
                break;
            default:
                throw new IllegalArgumentException("Invalid sort field: " + sort);
        }
        return query.fetch();
    }

    public void resetPersistenceContext() {
        entityManager.flush();
        entityManager.clear();
    }
}
