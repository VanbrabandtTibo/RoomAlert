import Adafruit_DHT
import time
sensor = Adafruit_DHT.DHT22
DHT22_pin = 4

while True:
    humidity, temperature = Adafruit_DHT.read_retry(sensor, DHT22_pin)
    if humidity is not None and temperature is not None:
        print('Temperature={0:0.1f}°C  Humidity={1:0.1f}%'.format(
            temperature, humidity))
    else:
        print('Failed to get reading from the sensor. Try again!')

    time.sleep(3)
