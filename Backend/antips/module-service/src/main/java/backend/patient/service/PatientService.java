package backend.patient.service;

import backend.patient.domain.Patient;
import backend.patient.dto.RequestPatientDto;
import backend.patient.dto.ResponsePatientDto;
import backend.patient.dtomapper.PatientMapper;
import backend.patient.exception.PatientNotFoundException;
import backend.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class PatientService {
    private final PatientMapper patientMapper;
    private final PatientRepository patientRepository;
    public ResponsePatientDto create(RequestPatientDto requestPatientDto) {
        Patient patient = patientMapper.dtoToEntity(requestPatientDto);
        Patient savedPatient = patientRepository.save(patient);
        return savedPatient.entityToDto(savedPatient);
    }

    public ResponsePatientDto get(Long patientId) {
        Patient patient = patientRepository.findById(patientId).
                orElseThrow(()-> new PatientNotFoundException(patientId+"에 해당하는 환자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        return patient.entityToDto(patient);
    }
}
