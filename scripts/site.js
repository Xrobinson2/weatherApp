"use strict";







const cityDropdown = document.getElementById("cityDropdown");
const outputTable = document.getElementById("outputTable");
const stationLookupUrl = "http://api.weather.gov/points/"




window.onload = () => {

    console.log("connected");
    populateCityDropDown();
    cityDropdown.onchange = onCityDropdownChange;
}

function onCityDropdownChange() {
    outputTable.innerHTML = "";
    let objectToDisplay;
    if (cityDropdown.value != "") {
        for (let i of locationsArray) {
            if (cityDropdown.value == i.name) {
                objectToDisplay = i;
            }
        }
    }
    if (objectToDisplay != null) {
       
        stationLookup(objectToDisplay);


    }
}

function populateCityDropDown() {
    let option = new Option("select a value", "");
    cityDropdown.appendChild(option);
    for (let i of locationsArray) {
        option = new Option(i.name, i.name);

        cityDropdown.appendChild(option);
    }
}

function forecastArrayApiCall(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            

            let periodsArray = data.properties.periods;

            for (let i of periodsArray) {
                outputTable.appendChild(createTableData(i));
            }

        })
}

function stationLookup(object) {
    let url = `${object.latitude},${object.longitude}`;
    let completedUrl = stationLookupUrl + url;

    fetch(completedUrl)
        .then(response => response.json())
        .then(data => {
            let forecastUrl = data.properties.forecast;
            forecastArrayApiCall(forecastUrl);

        })
}

function createTableData(forecastObj) {
    

    let tr = document.createElement("tr");
    if (forecastObj.shortForecast.includes("Thunderstorms")) {
        tr.classList.add("table-danger")
    }

    let forecast = document.createElement("td");
    let temperature = document.createElement("td");
    let winds = document.createElement("td");
    let shortForecast = document.createElement("td");
    let image = document.createElement("td");

    
    forecast.innerHTML = forecastObj.name;
    tr.appendChild(forecast);

    temperature.innerHTML = `${forecastObj.temperature}${forecastObj.temperatureUnit}`;
    tr.appendChild(temperature);
    
    winds.innerHTML = `Winds: ${forecastObj.windSpeed} ${forecastObj.windDirection}`;
    tr.appendChild(winds);
   
    shortForecast.innerHTML = forecastObj.shortForecast;
    tr.appendChild(shortForecast);
    
    let forecastIcon = document.createElement("img");
    forecastIcon.src = forecastObj.icon;
    image.appendChild(forecastIcon);
    tr.appendChild(image);



    return tr;
}