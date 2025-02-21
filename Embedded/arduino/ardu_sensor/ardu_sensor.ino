#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include "HX711.h"
#include <LiquidCrystal_I2C.h>

// 🔹 I2C LCD (16x2) 설정
LiquidCrystal_I2C lcd(0x27, 16, 2);

#define TEMP_BUTTON 4   // 🔴 체온 측정 버튼 (D4)
#define IV_BUTTON 9     // 🔹 초기 수액 무게 설정 버튼 (D9)

// HX711 핀 설정
#define LOADCELL_DOUT_PIN 3
#define LOADCELL_SCK_PIN 2

// MLX90614 적외선 온도 센서 객체 생성
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
HX711 scale;

float threshold = 10.0;
int averaging_count = 10;
float lastTemperature = -1.0;
float initial_weight = -1.0;
float previous_weight = -1.0;

// 🔹 버튼 디바운싱 타이머
unsigned long tempButtonLastPress = 0;
unsigned long ivButtonLastPress = 0;
unsigned long lastTempDisplayTime = 0;
const unsigned long debounceDelay = 200;
const unsigned long tempDisplayDuration = 5000;

void setup() {
    Serial.begin(115200);
    pinMode(TEMP_BUTTON, INPUT_PULLUP);
    pinMode(IV_BUTTON, INPUT_PULLUP);

    // 🔹 I2C LCD & 적외선 온도 센서 초기화
    Wire.begin();
    lcd.init();
    lcd.backlight();
    showDefaultMessage();

    // 🔹 무게 센서 초기화
    scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

    Serial.println("Taring... Please wait.");
    
    for (int i = 0; i < 5; i++) {  // 영점 조정을 5번 반복
        scale.tare();
        delay(500);
    }

    scale.set_offset(4294948585);    // 새로운 OFFSET 값 적용
    scale.set_scale(-221.467330);    // 새로운 SCALE 값 적용

    Serial.println("Scale calibration applied.");

    if (!mlx.begin()) {
    Serial.println("MLX90614 Sensor Error! Check wiring.");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("MLX90614 ERROR");
    lcd.setCursor(0, 1);
    lcd.print("Check Wiring!");
    while (1);
  }
}

void loop() {
    float weight = measureWeight();  // 안정화된 무게 측정

    // ✅ 현재 무게와 기준값을 시리얼 출력하여 디버깅
    Serial.print("Current Weight: ");
    Serial.println(weight);
    Serial.print("Threshold (20% of Initial): ");
    Serial.println(initial_weight * 0.2);

    // 🔹 초기 수액 무게 설정 버튼 처리
    if (digitalRead(IV_BUTTON) == LOW && millis() - ivButtonLastPress > debounceDelay) {
        ivButtonLastPress = millis();
        initial_weight = weight;
        Serial.println("New Initial Weight Set: " + String(initial_weight));

        // ✅ 초기 무게 설정 직후, 즉시 20% 확인 및 전송
        if (initial_weight > 0 && weight <= initial_weight * 0.2) {
            sendToESP32(2, -1);
            previous_weight = 2;
            Serial.println("⚠️ Immediate Send: Weight below 20% threshold!");
        }
    }

    // ✅ 20% 이하인지 체크 후 ESP32로 전송
    if (initial_weight > 0 && weight <= initial_weight * 0.2) {
        if (previous_weight != 2) {
            Serial.println("⚠️ Condition Met: Weight below 20% threshold! Sending alert...");
            sendToESP32(2, -1);
            previous_weight = 2;
        }
    } else {
        Serial.println("Weight is above 20% threshold.");
    }

    // 🔹 체온 측정 버튼 처리
    if (digitalRead(TEMP_BUTTON) == LOW && millis() - tempButtonLastPress > debounceDelay) {
        tempButtonLastPress = millis();
        Serial.println("Button Pressed! Measuring temperature...");
        
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Hold wrist close");
        lcd.setCursor(0, 1);
        lcd.print("to sensor...");
        delay(3000);

        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Measuring...");
        lcd.setCursor(0, 1);
        lcd.print("Please wait...");

        lastTemperature = measureTemperature() + 2;

        lcd.clear();
        if (lastTemperature > 0) {
            lcd.setCursor(0, 0);
            lcd.print("Temperature:");
            lcd.setCursor(0, 1);
            lcd.print(lastTemperature, 1);
            lcd.print(" C");

            lastTempDisplayTime = millis();
        } else {
            lcd.setCursor(0, 0);
            lcd.print("Measurement");
            lcd.setCursor(0, 1);
            lcd.print("Failed!");
        }

        sendToESP32(-1, lastTemperature);
    }

    // 🔹 **체온 표시 후 5초가 지나면 기본 화면으로 변경**
    if (lastTempDisplayTime > 0 && millis() - lastTempDisplayTime > tempDisplayDuration) {
        showDefaultMessage();
        lastTempDisplayTime = 0;
    }

    // ✅ 수액 무게가 2g 미만으로 줄어들었을 때 ESP32로 경고 전송
    if (weight < 2) {
        if (previous_weight != 1) {
            sendToESP32(1, -1);
            previous_weight = 1;
        }
    }
}

// 🔹 기본 메시지 출력
void showDefaultMessage() {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Press button to");
    lcd.setCursor(0, 1);
    lcd.print("measure temp.");
}

// 🔹 무게 측정 함수 (이동 평균 필터 적용)
float measureWeight() {
    float sum = 0;
    int numSamples = 20;  // 샘플 개수 증가하여 안정화

    for (int i = 0; i < numSamples; i++) {
        sum += scale.get_units(averaging_count);
        delay(50);
    }
    float filtered_weight = sum / numSamples;

    Serial.println("Filtered Weight: " + String(filtered_weight));
    return filtered_weight;
}

// 🔹 체온 측정 함수
float measureTemperature() {
    float tempSum = 0;
    int count = 0;

    while (count < 50) {
        float objectTemp = mlx.readObjectTempC();
        if (objectTemp > 25) {
            tempSum += objectTemp;
            count++;
        }
        delay(100);
    }

    return count > 0 ? tempSum / count : -1.0;
}

// 🔹 ESP32로 JSON 데이터 전송 (하드웨어 시리얼 사용)
void sendToESP32(float weight, float temperature) {
    String jsonData = "{";
    jsonData += "\"bedNumber\": \"101-1\", ";
    jsonData += "\"weight\": " + String(weight, 1) + ", ";
    jsonData += "\"temperature\": " + String(temperature, 1);
    jsonData += "}";

    Serial.println(jsonData);  // ESP32로 데이터 전송
    Serial.println("Sent to ESP32: " + jsonData);
}

