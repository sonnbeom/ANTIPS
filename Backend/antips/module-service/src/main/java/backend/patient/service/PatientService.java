package backend.patient.service;

import backend.patient.domain.Patient;
import backend.patient.dto.request.RequestOpenDrugBoxDto;
import backend.patient.dto.request.RequestPatientDto;
import backend.patient.dto.request.RequestPatientPatchDto;
import backend.patient.dto.response.ResponsePatientDto;
import backend.patient.dto.response.ResponsePatientListDto;
import backend.patient.mapper.PatientMapper;
import backend.patient.exception.PatientNotFoundException;
import backend.patient.repository.CustomPatientRepository;
import backend.patient.repository.PatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PatientService {
    
    private final PatientMapper patientMapper;
    
    private final PatientRepository patientRepository;
    
    private final CustomPatientRepository customPatientRepository;
    
    public ResponsePatientDto create(RequestPatientDto requestPatientDto) {
        Patient patient = patientMapper.dtoToEntity(requestPatientDto);
        Patient savedPatient = patientRepository.save(patient);
        return savedPatient.entityToDto(savedPatient);
    }

    public ResponsePatientDto getPatient(Long patientId) {
        Patient patient = findPatientById(patientId);
        return patient.entityToDto(patient);
    }

    public ResponsePatientListDto getPatients(String sort, String order, int floor) {
        List<Patient> patients = customPatientRepository.getPatientsBySort(sort, order, floor);
        if (patients.isEmpty()){
            return patientMapper.entityToDto();
        }
        else {
            return patientMapper.entityToDto(patients);

        }
    }

    public ResponsePatientDto patchPatient(RequestPatientPatchDto requestPatientPatchDto) {
        Patient patient = findPatientById(requestPatientPatchDto.getId());

        if (isValidFieldByPatientPatch(requestPatientPatchDto.getCaseHistory())){
            patient.updateCaseHistory(requestPatientPatchDto.getCaseHistory());
        }
        if (isValidFieldByPatientPatch(requestPatientPatchDto.getStatus())){
            patient.updateStatus(requestPatientPatchDto.getStatus());
        }
        if (isValidFieldByPatientPatch(requestPatientPatchDto.getFloor())){
            patient.updateFloor(requestPatientPatchDto.getFloor());
        }
        if (isValidFieldByPatientPatch(requestPatientPatchDto.getRoomNumber())){
            patient.updateRoomNumber(requestPatientPatchDto.getRoomNumber());
        }
        if (isValidFieldByPatientPatch(requestPatientPatchDto.getSpecifics())){
            patient.updateSpecifics(requestPatientPatchDto.getSpecifics());
        }
        if (isValidFieldByPatientPatch(requestPatientPatchDto.getTemperature())){
            patient.updateTemperature(requestPatientPatchDto.getTemperature());
        }
        if (isValidFieldByPatientPatch(requestPatientPatchDto.getUrgencyLevel())){
            patient.updateUrgencyLevel(requestPatientPatchDto.getUrgencyLevel());
        }
        if (isValidFieldByPatientPatch(requestPatientPatchDto.getStatus())){
            patient.updateStatus(requestPatientPatchDto.getStatus());
        }
        customPatientRepository.resetPersistenceContext();
        Patient updatedParent = findPatientById(requestPatientPatchDto.getId());
        return updatedParent.entityToDto(updatedParent);
    }

    public Patient findPatientById(Long patientId){
        return patientRepository.findById(patientId).
                orElseThrow(()-> new PatientNotFoundException(patientId+"에 해당하는 환자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
    }
    private <T> Boolean isValidFieldByPatientPatch(T request) {
        if (request instanceof String) {
            return request != null && !((String) request).isEmpty();
        }
        return request != null;
    }


    public void findQrCode(RequestOpenDrugBoxDto requestOpenDrugBoxDto) {
        Patient patient = patientRepository.findByQrCode(requestOpenDrugBoxDto.getQrCode()).
                orElseThrow(() -> new PatientNotFoundException(requestOpenDrugBoxDto.getQrCode() + "에 해당하는 qr 코드를 가진 환자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        patient.completeDeliverMedicine(patient);
    }

    public void delete(Long patientId) {
        Patient patient = findPatientById(patientId);
        patientRepository.delete(patient);
    }

    public Patient findPatientByBedNumber(String bedNumber) {
        return patientRepository.findByBedNumber(bedNumber).
                orElseThrow(()-> new PatientNotFoundException("침대번호"+bedNumber+"와 일치하는 환자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));

    }
}
