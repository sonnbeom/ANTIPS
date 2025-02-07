package backend.emergency.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseEmergencyDtoList {
    private int listSize ;
    private List<ResponseEmergencyDto> emergencyDtoList;
}
