package backend.constant;

import java.util.List;

public class UriConstant {
    public static final String AUTH_SERVER_URI = "http://localhost:8081/api/v1/auth/validate";
    public static final String AUTH_REQUIRED_PATH = "/api/v1/auth";
    public static final String AUTH_SERVICE_URL = "/api/v1/service/auth";
    public static final List<String> AUTH_REQUIRED_PATHS = List.of(
            "/api/v1/auth", "/api/v1/service/auth"
    );

}
