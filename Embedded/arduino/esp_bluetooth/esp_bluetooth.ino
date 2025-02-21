#include "BluetoothSerial.h"

BluetoothSerial SerialBT;  // 블루투스 시리얼 객체 생성

#define RXD2 16  // ESP32 RX2 (아두이노 TX0과 연결)
#define TXD2 17  // ESP32 TX2 (연결 안 함)

void setup() {
    Serial.begin(115200);
    Serial2.begin(115200, SERIAL_8N1, RXD2, TXD2);  // UART2 설정
    SerialBT.begin("ESP32_Bluetooth");  // 블루투스 기기명 설정

    Serial.println("✅ ESP32 블루투스 수신 및 송신 테스트 시작!");
}

void loop() {
    if (Serial2.available()) {
        String data = Serial2.readStringUntil('\n');  // 아두이노 데이터 읽기
        data.trim();  // 공백 제거

        if (data.length() > 0) {
            Serial.print("아두이노 → ESP32: ");
            Serial.println(data);

            // 블루투스로 전송
            SerialBT.println(data);
            Serial.println("✅ 블루투스로 데이터 전송 완료!");
        }
    }

    delay(100);
}
