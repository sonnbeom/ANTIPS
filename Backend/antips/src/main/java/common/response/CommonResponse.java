package common.response;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CommonResponse<T> {
    private int status;
    private String message;
    private T data;
}
