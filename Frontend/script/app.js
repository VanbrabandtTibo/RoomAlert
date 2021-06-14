const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

let history_page, dashboard, graphs, sleep;

const listenToSocket = function () {
    socket.on("connect", function () {
        console.log("Verbonden met socket webserver");
    });

    socket.on("B2F_temperature", function (jsonObject) {
        const temp = document.querySelector('.js-temperature');
        temp.innerHTML = '<p>' + jsonObject.data.temperature + ' °C</p>';
        const hum = document.querySelector('.js-humidity');
        hum.innerHTML = '<p>' + jsonObject.data.humidity + ' %</p>';
    });

    socket.on("B2F_CO2", function (jsonObject) {
        const co = document.querySelector('.js-co2');
        co.innerHTML = '<p>' + jsonObject.data.CO2 + ' ppm</p>';
    });
};

//#region ***  Callback-Visualisation - show___ ***
const showRows = function (jsonObject) {
    let rows = document.querySelector(".js-rows");
    rows.innerHTML = `<p>Aantal rijen: ${jsonObject.Aantal}</p>`;
};

const showStart = function (jsonObject) {
    let rows = document.querySelector(".js-start");
    let date = new Date(jsonObject.datumtijd)
    rows.innerHTML = `<p>Data van: ${date.toLocaleString()}</p>`;
};

const showEnd = function (jsonObject) {
    let rows = document.querySelector(".js-end");
    let date = new Date(jsonObject.datumtijd)
    rows.innerHTML = `<p>Data tot: ${date.toLocaleString()}</p>`;
};

const showSleepmode = function (jsonObject) {
    if (jsonObject.mode == 0) {
        sleep.style.backgroundColor = "white";
        sleep.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bed" class="svg-inline--fa fa-bed fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="width: 32px; height: 32px;">
        <path fill="currentColor" d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 
        7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 
        0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"></path></svg>
        <p>Not active</p>`
    }
    else {
        sleep.style.backgroundColor = "lightgray";
        sleep.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bed" class="svg-inline--fa fa-bed fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="width: 32px; height: 32px;">
        <path fill="currentColor" d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 
        7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 
        0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"></path></svg>
        <p>Active</p>`
    }
};

const showTemperature = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const temperature of jsonObject) {
        converted_labels.push(temperature.datumtijd);
        converted_data.push(temperature.waarde);
    }
    drawchart(converted_labels, converted_data, "Temperature", 6, 10, 0, 40);
};

const showHumidity = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const humidity of jsonObject) {
        converted_labels.push(humidity.datumtijd);
        converted_data.push(humidity.waarde);
    }
    drawchart(converted_labels, converted_data, "Humidity", 6, 10, 0, 100);
};

const showCO2 = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "CO2", 6, 10, 0, 2000);
};

//DDL TEMPERATURE
const showTemperatureHourly = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "Temperature", 6, 10, 0, 40);
};

const showTemperatureDaily = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "Temperature", 6, 10, 0, 40);
};

const showTemperatureMonthly = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "Temperature", 6, 10, 0, 40);
};

//DDL HUMIDITY
const showHumidityHourly = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "Humidity", 6, 10, 0, 100);
};

const showHumidityDaily = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "Humidity", 6, 10, 0, 100);
};

const showHumidityMonthly = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "Humidity", 6, 10, 0, 100);
};

//DDL CO2
const showCO2Hourly = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "CO2", 6, 10, 0, 2000);
};

const showCO2Daily = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "CO2", 6, 10, 0, 2000);
};

const showCO2Monthly = function (jsonObject) {
    let converted_labels = [];
    let converted_data = [];
    for (const co2 of jsonObject) {
        converted_labels.push(co2.datumtijd);
        converted_data.push(co2.waarde);
    }
    drawchart(converted_labels, converted_data, "CO2", 6, 10, 0, 2000);
};

const showTemperatureSettings = function(jsonObject){
    if (jsonObject.status == 0){
        document.getElementById("tempCheckbox").checked = false;
    }
    else if (jsonObject.status == 1){
        document.getElementById("tempCheckbox").checked = true;
    }
};

const showHumiditySettings = function(jsonObject){
    if (jsonObject.status == 0){
        document.getElementById("humCheckbox").checked = false;
    }
    else if (jsonObject.status == 1){
        document.getElementById("humCheckbox").checked = true;
    }
};

const showCO2Settings = function(jsonObject){
    if (jsonObject.status == 0){
        document.getElementById("co2Checkbox").checked = false;
    }
    else if (jsonObject.status == 1){
        document.getElementById("co2Checkbox").checked = true;
    }
};

const showTemperatureDashboardSettings = function(jsonObject){
    if (jsonObject.status == 0){
        document.querySelector(".js-item-temperature").style.display = "none";
    }
    else if (jsonObject.status == 1){
        document.querySelector(".js-item-temperature").style.display = "";
    }
};

const showHumidityDashboardSettings = function(jsonObject){
    if (jsonObject.status == 0){
        document.querySelector(".js-item-humidity").style.display = "none";
    }
    else if (jsonObject.status == 1){
        document.querySelector(".js-item-humidity").style.display = "";
    }
};

const showCO2DashboardSettings = function(jsonObject){
    if (jsonObject.status == 0){
        document.querySelector(".js-item-co2").style.display = "none";
    }
    else if (jsonObject.status == 1){
        document.querySelector(".js-item-co2").style.display = "";
    }
};

//#region *** callback ***
const callbackChangeSleepmode = function (data) {
    console.log(data);
};

const callbackChangeSettings = function(data) {
    console.log(data);
};
//#endregion

//#region *** Data Access - get____ ***


const getRows = function () {
    handleData(`http://${lanIP}/api/v1/rows`, showRows);
};

const getStart = function () {
    handleData(`http://${lanIP}/api/v1/startdate`, showStart);
};

const getEnd = function () {
    handleData(`http://${lanIP}/api/v1/enddate`, showEnd);
};

const getSleepmode = function () {
    handleData(`http://${lanIP}/api/v1/sleepmode`, showSleepmode);
};

const getTemperature = function () {
    handleData(`http://${lanIP}/api/v1/hourly/3`, showTemperature);
};

const getHumidity = function () {
    handleData(`http://${lanIP}/api/v1/hourly/2`, showHumidity);
};

const getCO2 = function () {
    handleData(`http://${lanIP}/api/v1/hourly/1`, showCO2);
};

// DDL TEMPERATURE
const getTemperatureHourly = function () {
    handleData(`http://${lanIP}/api/v1/hourly/3`, showTemperatureHourly);
};

const getTemperatureDaily = function () {
    handleData(`http://${lanIP}/api/v1/daily/3`, showTemperatureDaily);
};

const getTemperatureMonthly = function () {
    handleData(`http://${lanIP}/api/v1/monthly/3`, showTemperatureMonthly);
};

// DDL HUMIDITY
const getHumidityHourly = function () {
    handleData(`http://${lanIP}/api/v1/hourly/2`, showHumidityHourly);
};

const getHumidityDaily = function () {
    handleData(`http://${lanIP}/api/v1/daily/2`, showHumidityDaily);
};

const getHumidityMonthly = function () {
    handleData(`http://${lanIP}/api/v1/monthly/2`, showHumidityMonthly);
};

// DDL CO2
const getCO2Hourly = function () {
    handleData(`http://${lanIP}/api/v1/hourly/1`, showCO2Hourly);
};

const getCO2Daily = function () {
    handleData(`http://${lanIP}/api/v1/daily/1`, showCO2Daily);
};

const getCO2Monthly = function () {
    handleData(`http://${lanIP}/api/v1/monthly/1`, showCO2Monthly);
};

// Dashboard settings
const getTemperatureSettings = function(){
    handleData(`http://${lanIP}/api/v1/settings/1`, showTemperatureSettings);
};

const getHumiditySettings = function(){
    handleData(`http://${lanIP}/api/v1/settings/2`, showHumiditySettings);
};

const getCO2Settings = function(){
    handleData(`http://${lanIP}/api/v1/settings/3`, showCO2Settings);
};

const getTemperatureDashboardSettings = function(){
    handleData(`http://${lanIP}/api/v1/settings/1`, showTemperatureDashboardSettings);
};

const getHumidityDashboardSettings = function(){
    handleData(`http://${lanIP}/api/v1/settings/2`, showHumidityDashboardSettings);
};

const getCO2DashboardSettings = function(){
    handleData(`http://${lanIP}/api/v1/settings/3`, showCO2DashboardSettings);
};

//#region *** charts***

const drawchart = function (labels, data, name, tickAmountx, tickAmounty, min, max) {
    var options = {
        chart: {
            type: 'line',
        },
        stroke: {
            curve: 'stepline',
        },
        dataLabels: {
            enabled: false,
        },
        series: [
            {
                name: name,
                data: data,
            },
        ],
        labels: labels,
        noData: {
            text: "Loading...",
        },
        xaxis: {
            tickAmount: tickAmountx,
        },
        yaxis: {
            tickAmount: tickAmounty,
            min: min,
            max: max,
        },
    };
    var chart = new ApexCharts(document.querySelector(".js-chart"), options);
    chart.render();
    console.log("render chart");
};

//#region *** Listeners***
const listenToTemperatureBtn = function () {
    let tempBtn = document.querySelector(".js-temperature-graph");
    tempBtn.addEventListener("click", function () {
        document.querySelector(".js-chart-title").innerHTML = `<h2 style="text-align:center;">Temperature</h2>`;
        document.querySelector(".js-temperature-graph").style.backgroundColor = "lightgray";
        document.querySelector(".js-humidity-graph").style.backgroundColor = "white";
        document.querySelector(".js-co2-graph").style.backgroundColor = "white";
        getTemperature();
    });
};

const listenToHumidityBtn = function () {
    let humBtn = document.querySelector(".js-humidity-graph");
    humBtn.addEventListener("click", function () {
        document.querySelector(".js-chart-title").innerHTML = `<h2 style="text-align:center;">Humidity</h2>`;
        document.querySelector(".js-temperature-graph").style.backgroundColor = "white";
        document.querySelector(".js-humidity-graph").style.backgroundColor = "lightgray";
        document.querySelector(".js-co2-graph").style.backgroundColor = "white";
        getHumidity();
    });
};

const listenToCO2Btn = function () {
    let co2Btn = document.querySelector(".js-co2-graph");
    co2Btn.addEventListener("click", function () {
        document.querySelector(".js-chart-title").innerHTML = `<h2 style="text-align:center;">Carbon dioxide</h2>`;
        document.querySelector(".js-temperature-graph").style.backgroundColor = "white";
        document.querySelector(".js-humidity-graph").style.backgroundColor = "white";
        document.querySelector(".js-co2-graph").style.backgroundColor = "lightgray";
        getCO2();
    });
};

const ddlEvent = function (value) {
    console.log(value);
    if (document.querySelector(".js-temperature-graph").style.backgroundColor == "lightgray") {
        if (value == 1) {
            getTemperatureHourly();
        }
        else if (value == 2) {
            getTemperatureDaily();
        }
        else if (value == 3) {
            getTemperatureMonthly();
        }
    }
    else if (document.querySelector(".js-humidity-graph").style.backgroundColor == "lightgray") {
        if (value == 1) {
            getHumidityHourly();
        }
        else if (value == 2) {
            getHumidityDaily();
        }
        else if (value == 3) {
            getHumidityMonthly();
        }
    }
    else if (document.querySelector(".js-co2-graph").style.backgroundColor == "lightgray") {
        if (value == 1) {
            getCO2Hourly();
        }
        else if (value == 2) {
            getCO2Daily();
        }
        else if (value == 3) {
            getCO2Monthly();
        }
    }
};

const listenToSleepModeBtn = function () {
    sleep.addEventListener("click", function () {
        if (sleep.style.backgroundColor == "white") {
            sleep.style.backgroundColor = "lightgray";
            sleep.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bed" class="svg-inline--fa fa-bed fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="width: 32px; height: 32px;">
            <path fill="currentColor" d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 
            7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 
            0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"></path></svg>
            <p>Active</p>`;
            let object = {
                mode: 1
            };
            handleData(`http://${lanIP}/api/v1/change_sleepmode`, callbackChangeSleepmode, null, "PUT", JSON.stringify(object));
        }
        else if (sleep.style.backgroundColor == "lightgray") {
            sleep.style.backgroundColor = "white";
            sleep.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bed" class="svg-inline--fa fa-bed fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="width: 32px; height: 32px;">
            <path fill="currentColor" d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 
            7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 
            0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"></path></svg>
            <p>Not active</p>`;
            let object = {
                mode: 0
            };
            handleData(`http://${lanIP}/api/v1/change_sleepmode`, callbackChangeSleepmode, null, "PUT", JSON.stringify(object));
        }
    });
};

const listenToTemperatureCheck = function(){
    let tempCheck = document.getElementById("tempCheckbox");
    tempCheck.addEventListener("change", function(){
        if (document.getElementById("tempCheckbox").checked == true){
            let object = {
                status: 1,
                idsettings: 1
            };
            handleData(`http://${lanIP}/api/v1/change_settings`, callbackChangeSettings, null, "PUT", JSON.stringify(object));
        }
        else if (document.getElementById("tempCheckbox").checked == false){
            let object = {
                status: 0,
                idsettings: 1
            };
            handleData(`http://${lanIP}/api/v1/change_settings`, callbackChangeSettings, null, "PUT", JSON.stringify(object));
        }
    });
};

const listenToHumidityCheck = function(){
    let humCheck = document.getElementById("humCheckbox");
    humCheck.addEventListener("change", function(){
        if (document.getElementById("humCheckbox").checked == true){
            let object = {
                status: 1,
                idsettings: 2
            };
            handleData(`http://${lanIP}/api/v1/change_settings`, callbackChangeSettings, null, "PUT", JSON.stringify(object));
        }
        else if (document.getElementById("humCheckbox").checked == false){
            let object = {
                status: 0,
                idsettings: 2
            };
            handleData(`http://${lanIP}/api/v1/change_settings`, callbackChangeSettings, null, "PUT", JSON.stringify(object));
        }
    });
};

const listenToCO2Check = function(){
    let co2Check = document.getElementById("co2Checkbox");
    co2Check.addEventListener("change", function(){
        if (document.getElementById("co2Checkbox").checked == true){
            let object = {
                status: 1,
                idsettings: 3
            };
            handleData(`http://${lanIP}/api/v1/change_settings`, callbackChangeSettings, null, "PUT", JSON.stringify(object));
        }
        else if (document.getElementById("co2Checkbox").checked == false){
            let object = {
                status: 0,
                idsettings: 3
            };
            handleData(`http://${lanIP}/api/v1/change_settings`, callbackChangeSettings, null, "PUT", JSON.stringify(object));
        }
    });
};

const toggleNav = function () {
    let toggleTrigger = document.querySelectorAll(".js-toggle-nav");
    for (let i = 0; i < toggleTrigger.length; i++) {
        toggleTrigger[i].addEventListener("click", function () {
            console.log("Klasse toegevoegd...");
            document.querySelector("body").classList.toggle("has-mobile-nav");
        });
    }
};

// DOM content init
document.addEventListener("DOMContentLoaded", function () {
    console.info("DOM geladen");
    history_page = document.querySelector(".js-rows");
    dashboard = document.querySelector(".js-temperature");
    graphs = document.querySelector(".js-chart");
    sleep = document.querySelector(".js-sleep");
    settings = document.querySelector(".js-settings");
    info = document.querySelector(".js-info");

    if (dashboard) {
        toggleNav();
        listenToSocket();
        
        getTemperatureDashboardSettings();
        getHumidityDashboardSettings();
        getCO2DashboardSettings();
    }

    if (graphs) {
        toggleNav();
        getTemperature();
        document.querySelector(".js-temperature-graph").style.backgroundColor = "lightgray";
        listenToTemperatureBtn();
        listenToHumidityBtn();
        listenToCO2Btn();
    }

    if (sleep) {
        toggleNav();
        getSleepmode();
        listenToSleepModeBtn();
    }

    if (history_page) {
        toggleNav();
        getRows();
        getStart();
        getEnd();
    }

    if (settings) {
        toggleNav();
        getTemperatureSettings();
        getHumiditySettings();
        getCO2Settings();
        listenToTemperatureCheck();
        listenToHumidityCheck();
        listenToCO2Check();
    }

    if (info){
        toggleNav();
    }
});