from rpi_ws281x import *
import time

LED_COUNT = 8
LED_PIN = 18
LED_FREQ_HZ = 800000
LED_DMA = 10
LED_BRIGHTNESS = 25
LED_INVERT = False
LED_CHANNEL = 0


class Neopixel:
    def __init__(self, LC, LP, LFH, LD, LI, LB, LCH):
        self.led_count = LC
        self.led_pin = LP
        self.led_freq_hz = LFH
        self.led_dma = LD
        self.led_invert = LI
        self.led_brightness = LB
        self.led_channel = LCH
        self.strip = PixelStrip(self.led_count, self.led_pin, self.led_freq_hz, self.led_dma, self.led_invert, self.led_brightness, self.led_channel)
    
    def change_leds_by_ppm(self, ppm):
        if ppm <= 1000:
            for x in range(0, self.led_count):
                self.strip.setPixelColor(0, Color(0, 255, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(1, Color(0, 255, 0))
            self.strip.show()
        
        if ppm <= 1400 and ppm > 1000:
            for x in range(0, self.led_count):
                self.strip.setPixelColor(0, Color(255, 255, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(1, Color(255, 255, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(2, Color(255, 255, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(3, Color(255, 255, 0))
            self.strip.show()
        
        if ppm <= 1600 and ppm > 1400:
            for x in range(0, self.led_count):
                self.strip.setPixelColor(0, Color(244, 70, 17))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(1, Color(244, 70, 17))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(2, Color(244, 70, 17))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(3, Color(244, 70, 17))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(4, Color(244, 70, 17))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(5, Color(244, 70, 17))
            self.strip.show()
        
        if ppm > 1600:
            for x in range(0, self.led_count):
                self.strip.setPixelColor(0, Color(255, 0, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(1, Color(255, 0, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(2, Color(255, 0, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(3, Color(255, 0, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(4, Color(255, 0, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(5, Color(255, 0, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(6, Color(255, 0, 0))

            for x in range(0, self.led_count):
                self.strip.setPixelColor(7, Color(255, 0, 0))
            self.strip.show()

    def clear_leds(self):
        for x in range(0, self.led_count):
            self.strip.setPixelColor(x, Color(0, 0, 0))
        self.strip.show()
    
    def begin_leds(self):
        self.strip.begin()
