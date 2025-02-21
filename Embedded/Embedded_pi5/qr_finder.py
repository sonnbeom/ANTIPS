import cv2
from pyzbar.pyzbar import decode
import time
import mqtt_pub

patient_code = ""

# 카메라 연결
cap = cv2.VideoCapture(2)  # 0은 기본 카메라, 외장 카메라라면 1로 변경
last_time = time.time()

if not cap.isOpened():
    print("카메라를 열 수 없습니다.")
    exit()

while True:
    ret, frame = cap.read()
    pointList = []
    if not ret:
        print("카메라 프레임을 읽을 수 없습니다.")
        break

    current_time = time.time()
    # 이미지 크기 조정 (필요에 따라 사용)
    frame = cv2.resize(frame, (0, 0), fx=0.8, fy=0.8)
    
    if current_time - last_time >= 5:
  
      # QR 코드 디코딩
      decoded = decode(frame)
      for d in decoded:
          x, y, w, h = d.rect
          barcode_data = d.data.decode("utf-8")  # QR 데이터 추출
          barcode_type = d.type  # QR 코드 타입 추출
  
          # QR 코드 위치에 사각형 그리기
          topLeft = (x, y)
          bottomRight = (x + w, y + h)
          cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
          
          pointList.append((topLeft, bottomRight))
          
          # QR 코드 데이터 출력
          cv2.putText(frame, f"{barcode_data} ({barcode_type})", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
          #print(f"Data: {barcode_data}, Type: {barcode_type}")
          patient_code = barcode_data[-5:]
          print(f"patient CODE : {patient_code}")

          mqtt_pub.pub("QR",{"qrCode":patient_code})
          
        
      last_time = current_time
      for i, v in enumerate(pointList):
        print("index: {}, point: {}".format(i, v))

    # 결과 화면 출력
    cv2.imshow('QR Code Scanner', frame)

    # 'q'를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
# 리소스 해제
cap.release()
cv2.destroyAllWindows()

