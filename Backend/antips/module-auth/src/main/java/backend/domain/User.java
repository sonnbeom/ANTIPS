package backend.domain;

import backend.common.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;
    private String name;
    private String employeeNumber;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;

    public Role getRoleForToken() {
        return role;
    }

    public Long getIdForUserDetail() {
        return id;
    }

    public enum Role {
        ROLE_ADMIN,
        ROLE_EMPLOYEE
    }

}
