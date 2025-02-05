package backend.urgentcare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@Builder
@Getter
@AllArgsConstructor
public class ResponseUrgentCareDto {
    private Long urgentCareId;
    private String content;
    private LocalDateTime createdAt;
}
