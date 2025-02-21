import paho.mqtt.client as mqtt
import json

# MQTT 브로커 정보
broker_address = "localhost"  # MQTT 브로커 주소
topics = ["test","QR"]  # 구독할 토픽

file_path = 'Variable_servo_motor.txt'

# 메시지가 수신될 때 호출되는 콜백 함수
def on_message(client, userdata, message):
    payload = message.payload.decode("utf-8")  # 메시지 디코딩
    json_data = json.loads(payload)
    print(f"Received message: {json_data}")  # 메시지 출력
    
    with open(file_path,'w') as file:
        if json_data['qrCode'] == "1Bb47":
            file.write('0')
        elif json_data['qrCode'] == "1Bb3Q":
            file.write('1')
        else:
            pass
        ##2번 상자 열기

    #데이터 파싱 txt 파일 저장
    #with open("mqtt_test_messageParsing.txt","a") as f:
        #print("temperture:",json_data['temperature'])
        #print("weight:",json_data['weight'])

        #parsing_data = str(json_data['temperature'])
        #parsing_data += ' '
        #parsing_data += str(json_data['weight'])
        #f.write(parsing_data + '\n')

# MQTT 클라이언트 설정
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_message = on_message  # 콜백 함수 설정

# 브로커에 연결
client.connect(broker_address,1883)

# 토픽 구독
for topic in topics:
    client.subscribe(topic)

# 메시지 수신 대기
client.loop_forever()

