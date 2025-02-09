package backend.emergency.mapper;

import backend.emergency.domain.Emergency;
import backend.emergency.dto.request.RequestEmergencyDto;
import backend.emergency.dto.response.ResponseEmergencyDto;
import backend.emergency.dto.response.ResponseEmergencyDtoList;
import backend.patient.domain.Patient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmergencyMapper {
    public Emergency dtoToEntity(String title, String message, Patient patient) {
        return Emergency.builder()
                .title(title)
                .active(true)
                .content(message)
                .patient(patient)
                .build();
    }

    public ResponseEmergencyDtoList dtoToEntity(List<Emergency> emergencyList) {
        List<ResponseEmergencyDto> responseEmergencyDtoList = new ArrayList<>();
        for (Emergency emergency : emergencyList){
            ResponseEmergencyDto responseEmergencyDto = emergency.entityToDto(emergency);
            responseEmergencyDtoList.add(responseEmergencyDto);
        }
        return ResponseEmergencyDtoList.builder()
                .emergencyDtoList(responseEmergencyDtoList)
                .listSize(responseEmergencyDtoList.size())
                .build();
    }
}
