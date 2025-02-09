package backend.emergency.service;

import backend.emergency.dto.response.ResponseEmergencyDtoList;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class HttpSenderService {
    private final WebClient webClient = WebClient.create();

    public void sendEmergencyList(ResponseEmergencyDtoList emergencyList){
        String frontendUrl = "http:localhost:3000";

        webClient.post()
                .uri(frontendUrl)
                .bodyValue(emergencyList)
                .retrieve()
                .bodyToMono(ResponseEmergencyDtoList.class)
                .doOnSuccess(response -> System.out.println("프론트에 알림을 보냈습니다. " + response))
                .doOnError(error -> System.err.println("프론트에 알림을 보내지 않습니다 " + error.getMessage()))
                .subscribe();
    }
}
