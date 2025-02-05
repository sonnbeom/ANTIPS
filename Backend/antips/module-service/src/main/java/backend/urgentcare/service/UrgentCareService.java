package backend.urgentcare.service;

import backend.patient.domain.Patient;
import backend.patient.dto.response.ResponsePatientDto;
import backend.patient.service.PatientService;
import backend.urgentcare.domain.UrgentCare;
import backend.urgentcare.dto.request.RequestUrgentCareDto;
import backend.urgentcare.dto.response.ResponseUrgentCareDto;
import backend.urgentcare.dto.response.ResponseUrgentCareWithPatientDto;
import backend.urgentcare.mapper.UrgentCareMapper;
import backend.urgentcare.repository.CustomUrgentCareRepository;
import backend.urgentcare.repository.UrgentCareRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class UrgentCareService {
    private final UrgentCareMapper urgentCareMapper;
    private final UrgentCareRepository urgentCareRepository;
    private final PatientService patientService;
    private final CustomUrgentCareRepository customUrgentCareRepository;

    public ResponseUrgentCareDto create(RequestUrgentCareDto requestUrgentCareDto) {
        Patient parent = patientService.findPatientById(requestUrgentCareDto.getPatientId());
        UrgentCare urgentCare = urgentCareMapper.dtoToEntity(requestUrgentCareDto, parent);
        UrgentCare savedUrgentCare = urgentCareRepository.save(urgentCare);
        return savedUrgentCare.entityToDto(savedUrgentCare);
    }

    public ResponseUrgentCareWithPatientDto getUrgentCareWithParent(Long patientId) {

        Patient patient = patientService.findPatientById(patientId);
        List<UrgentCare> urgentCareList = customUrgentCareRepository.findUrgentCareListByParent(patient);
        List<ResponseUrgentCareDto> responseUrgentCareDtoList = urgentCareMapper.entityToDto(urgentCareList);
        ResponsePatientDto responsePatientDto = patient.entityToDto(patient);
        return ResponseUrgentCareWithPatientDto.builder()
                .urgentCareList(responseUrgentCareDtoList)
                .patient(responsePatientDto)
                .build();
    }
}
