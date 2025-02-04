package backend.patient.service;

import backend.patient.domain.Patient;
import backend.patient.dto.RequestPatientDto;
import backend.patient.dto.ResponsePatientDto;
import backend.patient.dtomapper.PatientMapper;
import backend.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
}
