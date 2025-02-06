package backend.patient.dto.request;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@NoArgsConstructor
@Getter
public class RequestOpenDrugBoxDto {
    private String qrCode;
}
