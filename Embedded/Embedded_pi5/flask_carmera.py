import cv2
from flask import Flask, Response
from threading import Thread
import time
import ssl

app = Flask(__name__)

# 카메라 장치 번호 (0은 기본 카메라)
camera_index = 0
cap = cv2.VideoCapture(camera_index)
# 카메라 해상도 설정
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)


if not cap.isOpened():
    print("카메라를 열 수 없습니다.")
    exit()

def generate_frames():
    while True:
        # 프레임 읽기
        success, frame = cap.read()
        if not success:
            break
        
        # 프레임 크기 조정
        #frame = cv2.resize(frame, (160, 120))

        # JPEG 인코딩
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY),40]  # 품질을 80으로 설정
        _, buffer = cv2.imencode('.jpg', frame, encode_param)
        #_, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # 프레임을 HTTP 스트림 형식으로 반환
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        time.sleep(1/30)
@app.route('/')
def index():
    return "<p><a href='/video_feed'>to video"


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
def run_app():
    app.run(host='0.0.0.0', port=8081,ssl_context='adhoc')
    #app.run(host='0.0.0.0', port=8081, ssl_context=('cert.pem','key.pem'))

    #app.run(host='0.0.0.0', port=443, ssl_context=('cert.pem','key.pem'))


if __name__ == '__main__':
    Thread(target=run_app).start()

#if __name__ == '__main__':
#    app.run(host='0.0.0.0', port=8081)  # 모든 IP에서 접근 가능

