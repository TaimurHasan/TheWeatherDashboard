var formEl = document.querySelector("#search-form");
var apiKey = "6d797a2c3d8a01c9b09004f544fc4746";
var searchHistory = [];
var weatherDash = document.querySelector("#weather");

// handle form input and send through api functions
var formHandler = function (event) {
    event.preventDefault();
    var cityInput = document.querySelector("input[id='city']").value.split(" ").join("");
    getCityDetails(cityInput);
}

// call on api specifically to get latitude and longitude from searched city name + save city name and country
var getCityDetails = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    
    fetch(apiUrl)
        .then(function(response) {
            response.json()
            .then(function(data) {
                var lon = data.coord.lon;
                var lat = data.coord.lat;
                var cityName = data.name;
                var country = data.sys.country;
                getWeather(lat, lon, cityName, country);
            })
        })
}

//call on onecall api to get weather from latitude and longitude
var getWeather = function (lat, lon, cityName, country) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;
    
    fetch(apiUrl)
        .then(function(response) {
            response.json()
            .then(function(data){
                displayCurrent(data, cityName, country);
            })
        })
}

// function to display weather fetched from api onto display
var displayCurrent = function(data, cityName, country) {
    console.log(data);

    // get full date
    var theTime = new Date(data.current.dt * 1000);
    var fullDate = getDate(theTime);


    var weatherDivEl = document.createElement("div");
    weatherDivEl.className = "col-8 current-weather";
    weatherDivEl.setAttribute("id", "current-weather");

    var weatherHeadEl = document.createElement("h1");
    weatherHeadEl.textContent = cityName + ", " + country + " - " + fullDate;

    weatherDivEl.appendChild(weatherHeadEl);
    weatherDash.appendChild(weatherDivEl);
    displayWeather(data, weatherDivEl);
};

// function to take the time and turn it into readable date
var getDate = function(theTime) {
    month = theTime.getMonth();
    date = theTime.getDate();
    year = theTime.getFullYear();

    var fullDate = month + "/" + date + "/" + year;
    return fullDate;
}

var displayWeather = function (data, selected) {
    console.log(data.current.temp);
    
    // required metrics
    var temp = "Temp: " + Math.round(data.current.temp) + '\xB0';
    var wind = "Wind: " + data.current.wind_speed + " MPH";
    var metrics = [temp, wind];
    
    var listEl = document.createElement("ul");
    
    for (var i = 0; i < metrics.length; i++) {
        var metric = metrics[i]; 
        var listItemEl = document.createElement("li");
        listItemEl.textContent = metric;
        listEl.appendChild(listItemEl);
    };
    
    selected.appendChild(listEl);

}

formEl.addEventListener("submit", formHandler)