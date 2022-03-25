var formEl = document.querySelector("#search-form");
var apiKey = "6d797a2c3d8a01c9b09004f544fc4746";

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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=" + apiKey;
    
    fetch(apiUrl)
        .then(function(response) {
            response.json()
            .then(function(data){
                displayCurrentWeather(data, cityName, country);
            })
        })
}

// function to display weather fetched from api onto display
var displayCurrentWeather = function(data, cityName, country) {
    console.log(cityName);
    console.log(country);
    console.log(data);

    
}

formEl.addEventListener("submit", formHandler)