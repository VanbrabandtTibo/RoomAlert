import RPi.GPIO as GPIO
from time import sleep

from typing import Text
from mfrc522 import SimpleMFRC522

GPIO.setmode(GPIO.BCM)
reader = SimpleMFRC522()

GPIO.setwarnings(False)


class BuzzerRFID:
    def __init__(self, buzzer):
        self.buzzer = buzzer
        GPIO.setup(self.buzzer, GPIO.OUT)

    def beep_on(self):
        GPIO.output(self.buzzer, GPIO.HIGH)

    def beep_off(self):
        GPIO.output(self.buzzer, GPIO.LOW)

    def buzzer_start(self):
        # self.beep_on()
        print("Alarm on")
        while True:
            id, text = reader.read()
            if id != 0:
                # self.beep_off()
                print("Alarm off")
                break
            sleep(1)
