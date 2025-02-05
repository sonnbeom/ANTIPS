package backend.patient.controller;


import backend.common.response.CommonResponse;
import backend.patient.dto.request.RequestPatientDto;
import backend.patient.dto.request.RequestPatientPatchDto;
import backend.patient.dto.response.ResponsePatientDto;
import backend.patient.dto.response.ResponsePatientListDto;
import backend.patient.service.PatientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


import static backend.common.constant.ConstantResponseMessage.*;

@RequestMapping("/api/v1/service")
@RestController
@RequiredArgsConstructor
@Slf4j
public class PatientController {
    private final PatientService patientService;

    @GetMapping("/non-public/free")
    public String welcome1(@RequestHeader("X-User-Id") String userId) {
        log.info(userId);
        return "인증 필요한 서비스 호출";
    }
    @GetMapping("/free")
    public String welcone(){
        return "인증 필요 없는 서비스 호출";
    }
    @PostMapping("/non-public/patient")
    public CommonResponse<ResponsePatientDto> createPatient(@RequestBody RequestPatientDto requestPatientDto){
        ResponsePatientDto responsePatientDto = patientService.create(requestPatientDto);
        return CommonResponse.<ResponsePatientDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responsePatientDto)
                .build();
    }
    @GetMapping("/non-public/patient")
    public CommonResponse<ResponsePatientDto> getPatient(@RequestParam Long patientId){
        ResponsePatientDto responsePatientDto = patientService.getPatient(patientId);
        return CommonResponse.<ResponsePatientDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responsePatientDto)
                .build();
    }
    @GetMapping("/non-public/patients")
    public CommonResponse<ResponsePatientListDto> getPatients(
            @RequestParam String sort,
            @RequestParam String order,
            @RequestParam int floor){
        ResponsePatientListDto responsePatientListDto = patientService.getPatients(sort, order, floor);
        return CommonResponse.<ResponsePatientListDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responsePatientListDto)
                .build();
    }
    @PatchMapping("/non-public/patient")
    public CommonResponse<ResponsePatientDto> patchPatient(
            @RequestBody RequestPatientPatchDto requestPatientPatchDto
            ){
        ResponsePatientDto responsePatientDto = patientService.patchPatient(requestPatientPatchDto);
        return CommonResponse.<ResponsePatientDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responsePatientDto)
                .build();
    }
    }

