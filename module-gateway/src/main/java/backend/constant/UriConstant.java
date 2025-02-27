package backend.constant;

import java.util.List;

public class UriConstant {
    public static final String AUTH_LOCAL_SERVER_URI = "http://localhost:8081/api/v1/auth/validate";
    public static final String AUTH_DOCKER_SERVER_URI = "http://auth-server:8081/api/v1/auth/validate";
    public static final String AUTH_IP_SERVER_URI = "http://43.203.254.199:8081/api/v1/auth/validate";
    public static final String AUTH_REQUIRED_PATH = "/api/v1/auth";
    public static final String AUTH_SERVICE_URL = "/api/v1/service/auth";
    public static final List<String> AUTH_REQUIRED_PATHS = List.of(
            "/api/v1/service/non-public"
    );

}
