#!/usr/bin/env python3
import rospy
import board
import busio
from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
from std_msgs.msg import String

class PWMThrottleHat:
    def __init__(self, pwm, channel):
        self.pwm = pwm
        self.channel = channel
        self.pwm.frequency = 60  # 주파수 설정

    def set_throttle(self, throttle):
        pulse = int(0xFFFF * abs(throttle))  # 16비트 듀티 사이클 계산

        if throttle > 0:  # 전진
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
        elif throttle < 0:  # 후진
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0xFFFF
            self.pwm.channels[self.channel + 3].duty_cycle = 0
        else:  # 정지
            self.pwm.channels[self.channel + 5].duty_cycle = 0
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0

class MotorControlNode:
    def __init__(self):
        rospy.init_node("motor_control_node", anonymous=True)

        # I2C 및 모터/서보 초기화
        i2c = busio.I2C(board.SCL, board.SDA)
        self.pca = PCA9685(i2c)
        self.pca.frequency = 60
        self.motor_hat = PWMThrottleHat(self.pca, channel=0)

        self.kit = ServoKit(channels=16, i2c=i2c, address=0x60)
        self.pan = 100  # 서보 모터 초기 위치 설정
        self.kit.servo[0].angle = self.pan

        self.speed = 0.0  # 초기 속도 설정

        # ROS Subscriber 설정
        rospy.Subscriber("/cmd_key", String, self.control_callback)

        rospy.loginfo("Motor control node started")
        rospy.spin()

    def control_callback(self, msg):
        key = msg.data.lower()  # 소문자로 변환

        if key == 'w':
            self.speed = min(1.0, self.speed + 0.1)  # 속도 증가 (최대 1.0)
            rospy.loginfo(f"Motor forward (speed: {self.speed})")
            self.motor_hat.set_throttle(self.speed)
        
        elif key == 's':
            self.speed = max(-1.0, self.speed - 0.1)  # 속도 감소 (최소 -1.0)
            rospy.loginfo(f"Motor backward (speed: {self.speed})")
            self.motor_hat.set_throttle(self.speed)
        
        elif key == 'a':
            self.pan = max(0, self.pan - 10)  # 서보 모터 왼쪽으로 이동
            self.kit.servo[0].angle = self.pan
            rospy.loginfo(f"Servo left (angle: {self.pan})")
        
        elif key == 'd':
            self.pan = min(180, self.pan + 10)  # 서보 모터 오른쪽으로 이동
            self.kit.servo[0].angle = self.pan
            rospy.loginfo(f"Servo right (angle: {self.pan})")
        
        elif key == 'q':  # 'q' 키를 누르면 종료
            rospy.loginfo("Stopping program")
            rospy.signal_shutdown("User requested shutdown")
        
        elif key == 'x':  # 정지 (X 키 추가)
            self.speed = 0.0
            self.motor_hat.set_throttle(0)
            rospy.loginfo("Motor stopped")

    def cleanup(self):
        self.motor_hat.set_throttle(0)  # 모터 정지
        self.kit.servo[0].angle = 100  # 서보 모터 초기 위치로 리셋
        self.pca.deinit()
        rospy.loginfo("Program stopped and motor stopped.")

if __name__ == "__main__":
    try:
        node = MotorControlNode()
    except rospy.ROSInterruptException:
        pass

