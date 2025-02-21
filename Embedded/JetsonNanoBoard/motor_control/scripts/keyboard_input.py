#!/usr/bin/env python3

import rospy
from std_msgs.msg import String
import sys
import termios
import tty

class KeyboardPublisher:
    def __init__(self):
        rospy.init_node("keyboard_publisher", anonymous=True)
        self.pub = rospy.Publisher("/cmd_key", String, queue_size=10)
        rospy.loginfo("Keyboard input node started")
        self.run()

    def get_key(self):
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(fd)
            key = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return key

    def run(self):
        while not rospy.is_shutdown():
            key = self.get_key()
            self.pub.publish(key)
            if key == 'q':
                break

if __name__ == "__main__":
    try:
        KeyboardPublisher()
    except rospy.ROSInterruptException:
        pass

