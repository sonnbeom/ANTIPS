package backend.patient.controller;

import backend.common.ConstantResponseMessage;
import backend.patient.dto.RequestPatientDto;
import backend.patient.dto.ResponsePatientDto;
import backend.patient.service.PatientService;
import backend.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import static backend.common.ConstantResponseMessage.*;

@RequestMapping("/api/v1/service")
@RestController
@RequiredArgsConstructor
@Slf4j
public class PatientController {
    private final PatientService patientService;

    @GetMapping("/auth/patient")
    public String welcome1() {
        return "인증 필요한 서비스 호출";
    }
    @GetMapping("/patient")
    public String welcone(){
        return "인증 필요 없는 서비스 호출";
    }
    @PostMapping("patient")
    public CommonResponse<ResponsePatientDto> createPatient(@RequestBody RequestPatientDto requestPatientDto){
        ResponsePatientDto responsePatientDto = patientService.create(requestPatientDto);
        return CommonResponse.<ResponsePatientDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responsePatientDto)
                .build();
    }
}
