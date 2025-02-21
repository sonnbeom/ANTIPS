# 덮어쓸 파일 경로
file_path = 'Variable_servo_motor.txt'

# 새로운 내용


while True:
# 파일 덮어쓰기
    new_content = input("입력:")
    with open(file_path, 'w') as file:
        file.write(new_content)
    if new_content == 'q':
        break
 

