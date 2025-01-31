package backend.patient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/service")
@RestController
@RequiredArgsConstructor
@Slf4j
public class PatientController {

    @GetMapping("/auth/patient")
    public String welcome1() {
        return "인증 필요한 서비스 호출";
    }
    @GetMapping("/patient")
    public String welcone(){
        return "인증 필요 없는 서비스 호출";
    }
}
