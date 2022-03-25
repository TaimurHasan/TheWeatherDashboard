var formEl = document.querySelector("#search-form")
var apiKey = "6d797a2c3d8a01c9b09004f544fc4746"

var formHandler = function (event) {
    event.preventDefault();
    var cityInput = document.querySelector("input[id='city']").value;
    getWeather(cityInput);
}

var getWeather = function (city) {
    apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    console.log(apiUrl);
}


formEl.addEventListener("submit", formHandler)