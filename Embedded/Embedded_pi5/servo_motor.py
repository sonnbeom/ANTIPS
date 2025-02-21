import RPi.GPIO as GPIO
import time

count = 1

# GPIO 핀 번호 설정
SERVO_PIN1 = 18
SERVO_PIN2 = 17

SERVO_PIN3 = 23
SERVO_PIN4 = 24

# GPIO 설정
GPIO.setmode(GPIO.BCM)

GPIO.setup(SERVO_PIN1, GPIO.OUT)
GPIO.setup(SERVO_PIN2, GPIO.OUT)
GPIO.setup(SERVO_PIN3, GPIO.OUT)
GPIO.setup(SERVO_PIN4, GPIO.OUT)



# PWM 설정
pwm1 = GPIO.PWM(SERVO_PIN1, 50)  # 50Hz
pwm2 = GPIO.PWM(SERVO_PIN2, 50)  # 50Hz
pwm3 = GPIO.PWM(SERVO_PIN3, 50)  # 50Hz
pwm4 = GPIO.PWM(SERVO_PIN4, 50)  # 50Hz

pwm1.start(0)
pwm2.start(0)
pwm3.start(0)
pwm4.start(0)


def set_angle1(angle):
    duty = angle / 18 + 2
    GPIO.output(SERVO_PIN1, True)
    pwm1.ChangeDutyCycle(duty)
    time.sleep(1)
    GPIO.output(SERVO_PIN1, False)
    pwm1.ChangeDutyCycle(0)

def set_angle2(angle):
    duty = angle / 18 + 2
    GPIO.output(SERVO_PIN2, True)
    pwm2.ChangeDutyCycle(duty)
    time.sleep(1)
    GPIO.output(SERVO_PIN2, False)
    pwm2.ChangeDutyCycle(0)
def set_angle3(angle):
    duty = angle / 18 + 2
    GPIO.output(SERVO_PIN3, True)
    pwm3.ChangeDutyCycle(duty)
    time.sleep(1)
    GPIO.output(SERVO_PIN3, False)
    pwm3.ChangeDutyCycle(0)
def set_angle4(angle):
    duty = angle / 18 + 2
    GPIO.output(SERVO_PIN4, True)
    pwm4.ChangeDutyCycle(duty)
    time.sleep(1)
    GPIO.output(SERVO_PIN4, False)
    pwm4.ChangeDutyCycle(0)

flag = None

def read_file():
    with open('Variable_servo_motor.txt','r') as file:
        return file.read().strip()

try:
    while True:
        time.sleep(0.5)
        new_flag = read_file()
        if new_flag != flag:
            if new_flag == '':
                continue
            flag = new_flag

            if flag=='1':
                print("[OPEN]")
                print('#',count," patient get medicine")
                set_angle2(0)
                set_angle2(0)
                set_angle2(0)
                set_angle1(180)
                count +=1
                
                time.sleep(5)
                print("[CLOSE]")
                set_angle1(0)
                time.sleep(2)

                set_angle2(90)
                set_angle2(90)
                set_angle2(90)

            elif flag=='0':
                print("[OPEN]")
                print('#',count," patient get medicine")
                set_angle3(90)
                set_angle4(180)
                count +=1
                
                time.sleep(5)
                print("[CLOSE]")
                set_angle4(0)
                time.sleep(2)

                set_angle3(0)
            elif flag=='S':
                pass

            elif flag=='q':
                pass
            else:
                print("ERROR")
except KeyboardInterrupt:
    pass

finally:
    pwm1.stop()
    pwm2.stop()
    pwm3.stop()
    pwm4.stop()
    GPIO.cleanup()


