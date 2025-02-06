package backend.patient.mapper;

import backend.patient.domain.Patient;
import backend.patient.dto.request.RequestPatientDto;
import backend.patient.dto.response.ResponsePatientDto;
import backend.patient.dto.response.ResponsePatientListDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static backend.common.constant.ConstantPatientStatus.*;

@Service
public class PatientMapper {

    public Patient dtoToEntity(RequestPatientDto requestPatientDto) {
        return Patient.builder()
                .age(requestPatientDto.getAge())
                .floor(requestPatientDto.getFloor())
                .name(requestPatientDto.getName())
                .caseHistory(requestPatientDto.getCaseHistory())
                .temperature(requestPatientDto.getTemperature())
                .specifics(requestPatientDto.getSpecifics())
                .urgencyLevel(requestPatientDto.getUrgencyLevel())
                .roomNumber(requestPatientDto.getRoomNumber())
                .qrCode(requestPatientDto.getQrCode())
                .status(TODO)
                .build();
    }

    public ResponsePatientListDto entityToDto(List<Patient> patients) {
        List<ResponsePatientDto> list = new ArrayList<>();
        for (Patient patient : patients){
            ResponsePatientDto responsePatientDto = patient.entityToDto(patient);
            list.add(responsePatientDto);
        }
        return ResponsePatientListDto.builder()
                .patientList(list)
                .listSize(list.size())
                .build();
    }

    public ResponsePatientListDto entityToDto() {
        return ResponsePatientListDto.builder()
                .patientList(new ArrayList<>())
                .listSize(0)
                .build();
    }
}
