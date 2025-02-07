package backend.emergency.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RequestEmergencyDto {
    private String token;
    private String bedNumber;
    private float temperature;
    private float sapWeight;
}
