import serial
import paho.mqtt.client as mqtt
import json

# 블루투스 설정
BLUETOOTH_PORT = "/dev/rfcomm1"  # HC-06 연결 포트
BAUD_RATE = 9600  # HC-06 기본 속도

# MQTT 설정
#MQTT_BROKER = "70.12.247.219"
MQTT_BROKER = "127.0.0.1"
MQTT_PORT = 1883
MQTT_TOPIC = "test"

def pub(topic_str, message_dict):
    mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT)
    mqtt_client.loop_start()

    message = json.dumps(message_dict)  # JSON 변환
    mqtt_client.publish(topic=topic_str, payload=message)

    mqtt_client.loop_stop()
    mqtt_client.disconnect()

try:
    # 블루투스 연결
    bluetooth = serial.Serial(BLUETOOTH_PORT, BAUD_RATE, timeout=5)
    print("Bluetooth 연결 성공")

    while True:
        if bluetooth.in_waiting > 0:
            received_data = bluetooth.readline().decode("utf-8").strip()
            print(f"수신된 데이터: {received_data}")

            try:
                jsonData = json.loads(received_data)  # JSON 변환
                pub(MQTT_TOPIC, jsonData)  # MQTT 발행
                print("MQTT 발행 완료")
            except json.JSONDecodeError:
                print("JSON 파싱 오류")

except KeyboardInterrupt:
    print("\n Bluetooth 연결 종료")

finally:
    if 'bluetooth' in locals() and bluetooth.is_open:
        bluetooth.close()
        print("Bluetooth 포트 닫힘")

