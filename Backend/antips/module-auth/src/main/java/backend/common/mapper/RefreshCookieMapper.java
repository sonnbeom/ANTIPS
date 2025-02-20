package backend.common.mapper;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import static backend.constant.ConstantCookie.ANTIPS;
import static backend.constant.ConstantCookie.REFRESH_TOKEN;

@Component
public class RefreshCookieMapper {

    public ResponseCookie responseCookie(String refreshToken){
        return ResponseCookie.from(REFRESH_TOKEN, refreshToken)
                .httpOnly(true) // 이 옵션을 true로 설정하면, 쿠키가 HTTP(S)를 통해서만 접근 가능하게 됩니다. 즉, 클라이언트 사이드 스크립트(JS 등)에서는 document.cookie를 통해 이 쿠키에 접근할 수 없게 됩니다. 이는 XSS(Cross-site Scripting) 공격으로부터 쿠키를 보호하는 데 도움이 됩니다.
                .secure(true) //  이 옵션을 true로 설정하면, 쿠키는 HTTPS 프로토콜을 사용하는 요청에서만 전송됩니다. 이는 쿠키가 암호화되지 않은 채널을 통해 전송되는 것을 방지하여, MITM(Man-In-The-Middle) 공격으로부터 보호합니다.
                .path("/") // 쿠키가 전송될 경로를 지정한다. "/"로 설정하면 도메인의 모든 경로에 대해 쿠키가 전송된다.
                .maxAge(604800) //7일
                .domain(ANTIPS) //이 옵션은 쿠키가 전송될 도메인을 지정합니다.
                .build();
    }
    public ResponseCookie deleteCookie(){
        return ResponseCookie.from(REFRESH_TOKEN, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .domain(ANTIPS)
                .build();
    }
}
