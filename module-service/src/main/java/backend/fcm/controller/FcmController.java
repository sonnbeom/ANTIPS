package backend.fcm.controller;

import backend.common.response.CommonResponse;
import backend.fcm.dto.request.RequestFcmDto;
import backend.fcm.dto.response.ResponseFcmDto;
import backend.fcm.service.FcmTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static backend.common.constant.ConstantResponseMessage.SUCCESS;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/service")
public class FcmController {

    private final FcmTokenService fcmTokenService;

    @PostMapping("non-public/fcm-token")
    public CommonResponse<ResponseFcmDto> saveFcmToken(@RequestBody RequestFcmDto requestFcmDto){
        ResponseFcmDto responseFcmDto = fcmTokenService.saveFcmToken(requestFcmDto);
        return CommonResponse.<ResponseFcmDto>builder()
                .message(SUCCESS)
                .status(200)
                .data(responseFcmDto)
                .build();
    }
}
