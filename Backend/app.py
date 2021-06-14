from os import write
from types import resolve_bases
from flask.wrappers import Request
from smbus import SMBus
import time
import Adafruit_DHT
from datetime import datetime
import threading

from LCDisplay import LCD
from Neopixel import Neopixel
from BuzzerRFID import BuzzerRFID

from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
from flask import Flask, json, jsonify, request
from repositories.DataRepository import DataRepository

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522


# LEDSTRIP
LED_COUNT = 8
LED_PIN = 18
LED_FREQ_HZ = 800000
LED_DMA = 10
LED_BRIGHTNESS = 25
LED_INVERT = False
LED_CHANNEL = 0

#Buzzer
buzzer = 20

# Code voor Hardware

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

sensor = Adafruit_DHT.DHT22
DHT22_pin = 4


def read_DHT():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, DHT22_pin)
    if humidity is not None and temperature is not None:
        temperature = round(temperature, 1)
        humidity = round(humidity, 0)
        return {'temperature': temperature, 'humidity': humidity}
    else:
        print('Failed to get reading from the sensor. Try again!')


SLAVE_ADDR = 0x5B  # Can be 0x5A

# Slave registers to read and write
DEVICE_REG_STATUS = 0x00
DEVICE_REG_MEAS_MODE = 0x01
DEVICE_REG_ALG_RESULT_DATA = 0x02
DEVICE_REG_ERROR_ID = 0xE0
DEVICE_REG_APP_START = 0xF4

# Slave register read values
DEVICE_STATE_BOOT = 0x10
DEVICE_STATE_APP = 0x90
DEVICE_STATE_APP_WITH_DATA = 0x98

# Slave register write values
DEVICE_SET_MODE_10S = [0x10]
DEVICE_SET_SW_RESET = [0x11, 0xE5, 0x72, 0x8A]

# 0 = /dev/i2c-0 (port I2C0), 1 = /dev/i2c-1 (port I2C1)


def read_CCS811():
    i2c_bus = SMBus(1)

    def read_i2c_bus_dev(dev_reg, read_len):
        return i2c_bus.read_i2c_block_data(SLAVE_ADDR, dev_reg, read_len)

    def write_i2c_bus_dev(dev_reg, write_data):
        i2c_bus.write_i2c_block_data(SLAVE_ADDR, dev_reg, write_data)

    if read_i2c_bus_dev(DEVICE_REG_STATUS, 1)[0] == DEVICE_STATE_BOOT:
        write_i2c_bus_dev(DEVICE_REG_APP_START, [])  # empty write
        write_i2c_bus_dev(DEVICE_REG_MEAS_MODE, DEVICE_SET_MODE_10S)

    read_i2c_bus_dev(DEVICE_REG_ERROR_ID, 1)  # clear any errors

    timeout_in_seconds = 30

    while (timeout_in_seconds and
            (read_i2c_bus_dev(DEVICE_REG_STATUS, 1)[0] !=
             DEVICE_STATE_APP_WITH_DATA)):
        time.sleep(5)
        timeout_in_seconds -= 5

    read_data = read_i2c_bus_dev(DEVICE_REG_ALG_RESULT_DATA, 8)

    eCO2_reading = (read_data[0] << 8) | read_data[1]

    # Return dictionary!
    return {'CO2': eCO2_reading}

# Code voor Flask


app = Flask(__name__)
app.config['SECRET_KEY'] = 'geheim!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False, engineio_logger=False, ping_timeout=1)

CORS(app)


@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(e)

# START een thread op. Belangrijk!!! Debugging moet UIT staan op start van de server, anders start de thread dubbel op
# werk enkel met de packages gevent en gevent-websocket.

state = 0
sleepmode = 0
display = LCD()

def read_all_sensors():
    while True:
        global state
        global sleepmode
        global display

        rDHT = read_DHT()
        rCO2 = read_CCS811()
        today = datetime.today()

        DataRepository.create_log(today, rDHT['temperature'], 3) #data in database
        DataRepository.create_log(today, rDHT['humidity'], 2) #data in database
        DataRepository.create_log(today, rCO2['CO2'], 1) #data in database

        socketio.emit('B2F_temperature', {'data': rDHT}, broadcast=True) #capture op website
        socketio.emit('B2F_CO2', {'data': rCO2}, broadcast=True) #capture op website

        if sleepmode == 0:
            th_display = "Temp: " + str(rDHT['temperature']) + u" \xDF" + "C" #LCD
            co_display = "CO2: " + str(rCO2['CO2']) + " ppm" #LCD
            display.lcd_display_string(th_display, 1) #LCD
            display.lcd_display_string(co_display, 2) #LCD

            led = Neopixel(LED_COUNT, LED_PIN, LED_FREQ_HZ , LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL) #LED
            led.begin_leds() #LED
            led.change_leds_by_ppm(int(rCO2['CO2'])) #LED

            if rCO2['CO2'] > 1600: #RFID - BUZZER
                if state == 0: #RFID - BUZZER
                    buzzerrfid = BuzzerRFID(buzzer) #RFID - BUZZER
                    buzzerrfid.buzzer_start() #RFID - BUZZER
                    state += 1 #RFID - BUZZER
                else: #RFID - BUZZER
                    state = 0 #RFID - BUZZER

        elif sleepmode == 1:
            display.backlight(0)
            led = Neopixel(LED_COUNT, LED_PIN, LED_FREQ_HZ , LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL) #LED
            led.begin_leds() #LED
            led.clear_leds() #LED

        time.sleep(1)


start_program = threading.Timer(1, read_all_sensors)
start_program.start()


print("**** Program started ****")

# API ENDPOINTS
endpoint = '/api/v1'

@socketio.on('connect')
def initial_connection():
    print('A new client connect')

# API ROUTES
@app.route('/')
def hallo():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."


### Aantal rijen in de database
@app.route(endpoint + '/rows', methods=['GET'])
def get_rows():
    data = DataRepository.count_rows()
    if data is not None:
        return jsonify(data), 200
    else:
        return jsonify(status="error"), 404

### Start datum van de capture
@app.route(endpoint + '/startdate', methods=['GET'])
def get_startdate():
    data = DataRepository.read_startdate()
    if data is not None:
        return jsonify(data), 200
    else:
        return jsonify(status="error"), 404

### Eind datum van de capture
@app.route(endpoint + '/enddate', methods=['GET'])
def get_enddate():
    data = DataRepository.read_enddate()
    if data is not None:
        return jsonify(data), 200
    else:
        return jsonify(status="error"), 404

### Slaapmodes checken welke mode + display backlight aan en uit zetten op basis van de modus
@app.route(endpoint + '/sleepmode', methods=['GET'])
def get_sleepmode():
    data = DataRepository.read_sleepmode()
    if data is not None:
        return jsonify(data), 200

    else:
        return jsonify(status="error"), 404

### Slaapmodus veranderen, als er op de button geklikt wordt op de html pagina    
@app.route(endpoint + '/change_sleepmode', methods=['PUT'])
def change_sleepmode():
    global sleepmode
    if request.method == 'PUT':
        data = DataRepository.json_or_formdata(request)
        DataRepository.update_sleepmode(data['mode'])
        if data['mode'] == 0:
            print("sleepmode uit")
            sleepmode = 0
            return jsonify(data), 200

        elif data['mode'] == 1:
            print("sleepmode aan")
            sleepmode = 1
            return jsonify(data), 200

#################### HISTORY
### hourly
@app.route(endpoint + '/hourly/<deviceID>', methods=['GET'])
def get_hourly(deviceID):
    data = DataRepository.read_history_hourly(deviceID)
    if data is not None:
        return jsonify(data), 200
    else:
        return jsonify(status="error"), 404

### daily
@app.route(endpoint + '/daily/<deviceID>', methods=['GET'])
def get_daily(deviceID):
    data = DataRepository.read_history_daily(deviceID)
    if data is not None:
        return jsonify(data), 200
    else:
        return jsonify(status="error"), 404

### monthly
@app.route(endpoint + '/monthly/<deviceID>', methods=['GET'])
def get_monthly(deviceID):
    data = DataRepository.read_history_monthly(deviceID)
    if data is not None:
        return jsonify(data), 200
    else:
        return jsonify(status="error"), 404

#################### SETTINGS
### READ
@app.route(endpoint + '/settings/<idsettings>', methods=['GET'])
def get_settings(idsettings):
    data = DataRepository.read_settings(idsettings)
    if data is not None:
        return jsonify(data), 200
    else:
        return jsonify(status="error"), 404

### UPDATE
@app.route(endpoint + '/change_settings', methods=['PUT'])
def change_settings():
    data = DataRepository.json_or_formdata(request)
    DataRepository.update_settings(data['status'], data['idsettings'])
    if request.method == 'PUT':
        print("changed")
        return jsonify(data), 200
    else:
        return jsonify(status="error"), 404

# ANDERE FUNCTIES
if __name__ == '__main__':
    socketio.run(app, debug=False, host='0.0.0.0')
