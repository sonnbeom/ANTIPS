package backend.emergency.controller;

import backend.emergency.dto.request.RequestEmergencyDto;
import backend.emergency.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/service")
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping("/public/emergency")
    public void checkEmergency(@RequestBody RequestEmergencyDto requestEmergencyDto) {
        log.info("컨트롤러 호출");
        emergencyService.isEmergency(requestEmergencyDto);
        log.info("컨트롤러 호출 메시지 전송 완료");
    }
}

