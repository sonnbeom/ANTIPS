import RPi.GPIO as GPIO
import pexpect
import time

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def make_call():
    child = pexpect.spawn('twinkle -c', encoding='utf-8', timeout=30)
    child.expect('Twinkle>')
   # print("전:",child.before)
    # Make the call
    child.sendline('call sip:123@172.20.10.5')

   # print("후:",child.after)
    
    child.expect(['Ringing','Connected','Busy'],timeout=20)

    # Wait for a few seconds to allow the call to connect
    time.sleep(100)
    
    # Hang up the call
    child.sendline('hangup')
    child.expect('Twinkle>')
    
    # Exit Twinkle
    child.sendline('quit')
    child.close()

try:
    print("Press GPIO 4 to make a call...")
    while True:
        if GPIO.input(17) == GPIO.LOW:
            print("Making call...")
            make_call()
            print("Call ended.")
            time.sleep(1)  # Debounce
finally:
    GPIO.cleanup()

