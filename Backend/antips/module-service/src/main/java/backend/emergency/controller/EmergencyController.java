package backend.emergency.controller;

import backend.common.constant.ConstantResponseMessage;
import backend.common.response.CommonResponse;
import backend.emergency.dto.request.RequestEmergencyDto;
import backend.emergency.dto.request.RequestFcmDto;
import backend.emergency.dto.response.ResponseFcmDto;
import backend.emergency.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import static backend.common.constant.ConstantResponseMessage.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/service")
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping("non-public/fcm-token")
    public CommonResponse<ResponseFcmDto> saveFcmToken(@RequestBody RequestFcmDto requestFcmDto){
        ResponseFcmDto responseFcmDto = emergencyService.saveFcmToken(requestFcmDto);
        return CommonResponse.<ResponseFcmDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responseFcmDto)
                .build();
    }
    @PostMapping("/public/emergency")
    public void checkEmergency(@RequestBody RequestEmergencyDto requestEmergencyDto) {
        log.info("컨트롤러 호출");
        emergencyService.isEmergency(requestEmergencyDto);
        log.info("컨트롤러 호출 메시지 전송 완료");
    }
}

