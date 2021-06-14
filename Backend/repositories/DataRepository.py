from repositories.Database import Database
from datetime import datetime, timedelta

class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def create_log(datumtijd, waarde, deviceID):
        sql = "INSERT INTO historiek(datumtijd, waarde, deviceID) VALUES(%s,%s,%s)"
        params = [datumtijd, waarde, deviceID]
        return Database.execute_sql(sql, params)

    @staticmethod
    def read_devices():
        sql = "SELECT * FROM device;"
        return Database.get_rows(sql)
    
    ### aantal rijen in de database
    def count_rows():
        sql = "SELECT COUNT(idhistoriek) AS Aantal FROM historiek;"
        return Database.get_one_row(sql)
    
    ### begin datum database
    def read_startdate():
        sql = "SELECT datumtijd FROM historiek ORDER BY datumtijd ASC LIMIT 1;"
        return Database.get_one_row(sql)
    
    ### eind datum database
    def read_enddate():
        sql = "SELECT datumtijd FROM historiek ORDER BY datumtijd DESC LIMIT 1;"
        return Database.get_one_row(sql)

    ### slaapmodus status
    def read_sleepmode():
        sql = "SELECT mode FROM sleepmode;"
        return Database.get_one_row(sql)
    
    ### slaapmodus change
    def update_sleepmode(mode):
        sql = "UPDATE sleepmode SET mode = %s WHERE idsleepmode = 1;"
        params = [mode]
        return Database.execute_sql(sql, params)
    
#################### HISTORY
    ### history hourly
    def read_history_hourly(sensorid):
        now = datetime.now()
        now_hour = now - timedelta(hours=1)
        sql = "SELECT datumtijd, waarde FROM historiek WHERE deviceID = %s AND datumtijd <= %s AND datumtijd >= %s;"
        params = [sensorid, now, now_hour]
        return Database.get_rows(sql, params)
    
    ### history daily
    def read_history_daily(sensorid):
        now = datetime.now()
        now_hour = now - timedelta(days=1)
        sql = "SELECT datumtijd, waarde FROM historiek WHERE deviceID = %s AND datumtijd <= %s AND datumtijd >= %s;"
        params = [sensorid, now, now_hour]
        return Database.get_rows(sql, params)

    ### history monthly
    def read_history_monthly(sensorid):
        now = datetime.now()
        now_hour = now - timedelta(days=30)
        sql = "SELECT datumtijd, waarde FROM historiek WHERE deviceID = %s AND datumtijd <= %s AND datumtijd >= %s;"
        params = [sensorid, now, now_hour]
        return Database.get_rows(sql, params)
    
#################### Dashboard settings
    def read_settings(idsettings):
        sql = "SELECT status FROM settings WHERE idsettings = %s;"
        params = [idsettings]
        return Database.get_one_row(sql, params)
    
    def update_settings(status, idsettings):
        sql = "UPDATE settings SET status = %s WHERE idsettings = %s"
        params = [status, idsettings]
        return Database.execute_sql(sql, params)