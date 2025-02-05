package backend.urgentcare.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestUrgentCareDto {
    private Long patientId;
    private String content;
}
