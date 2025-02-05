package backend.urgentcare.controller;

import backend.common.response.CommonResponse;
import backend.urgentcare.dto.request.RequestUrgentCareDto;
import backend.urgentcare.dto.response.ResponseUrgentCareDto;
import backend.urgentcare.service.UrgentCareService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
