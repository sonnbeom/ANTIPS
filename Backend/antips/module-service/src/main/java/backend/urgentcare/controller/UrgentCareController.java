package backend.urgentcare.controller;

import backend.common.response.CommonResponse;
import backend.urgentcare.dto.request.RequestUrgentCareDto;
import backend.urgentcare.dto.response.ResponseUrgentCareDto;
import backend.urgentcare.dto.response.ResponseUrgentCareWithPatientDto;
import backend.urgentcare.service.UrgentCareService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import static backend.common.constant.ConstantResponseMessage.SUCCESS;

@RequestMapping("/api/v1/service")
@RestController
@RequiredArgsConstructor
@Slf4j
public class UrgentCareController {

    private final UrgentCareService urgentCareService;

    @PostMapping("/urgent-care")
    public CommonResponse<ResponseUrgentCareDto> createUrgentCare(
            @RequestBody RequestUrgentCareDto requestUrgentCareDto){
        ResponseUrgentCareDto responseUrgentCareDto = urgentCareService.create(requestUrgentCareDto);
        return CommonResponse.<ResponseUrgentCareDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responseUrgentCareDto)
                .build();
    }
    @GetMapping("/urgent-care/emergency")
    public CommonResponse<ResponseUrgentCareWithPatientDto> getUrgentCareWithPatient(
            @RequestParam Long patientId){
        ResponseUrgentCareWithPatientDto responseUrgentCareWithPatientDto = urgentCareService.getUrgentCareWithParent(patientId);
        return CommonResponse.<ResponseUrgentCareWithPatientDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responseUrgentCareWithPatientDto)
                .build();
    }
}
