package backend.patient.dtomapper;

import backend.patient.domain.Patient;
import backend.patient.dto.RequestPatientDto;
import org.springframework.stereotype.Service;

@Service
public class PatientMapper {

    public Patient dtoToEntity(RequestPatientDto requestPatientDto) {
        return Patient.builder()
                .floor(requestPatientDto.getFloor())
                .name(requestPatientDto.getName())
                .caseHistory(requestPatientDto.getCaseHistory())
                .temperature(requestPatientDto.getTemperature())
                .specifics(requestPatientDto.getSpecifics())
                .urgencyLevel(requestPatientDto.getUrgencyLevel())
                .roomNumber(requestPatientDto.getRoomNumber())
                .admissionDate(requestPatientDto.getAdmissionDate())
                .build();
    }
}
