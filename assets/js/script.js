var formEl = document.querySelector("#search-form");
var apiKey = "6d797a2c3d8a01c9b09004f544fc4746";
var weatherDash = document.querySelector("#weather");

// variables for search history
var searchHistory = [];
var historyDisplay = document.querySelector("#history-display");

// handle form input and send through api functions
var formHandler = function (event) {
    event.preventDefault();
    // cleanup any previous searches
    weatherDash.innerHTML = "";
    
    var cityInput = document.querySelector("input[id='city']").value;
    getCityDetails(cityInput);
}

var buttonHandler = function (event) {
    weatherDash.innerHTML = "";
    selectedBtn = event.target.textContent;
    getCityDetails(selectedBtn);
}

// call on api specifically to get latitude and longitude from searched city name + save city name and country
var getCityDetails = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json()
                .then(function(data) {
                    var lon = data.coord.lon;
                    var lat = data.coord.lat;
                    var cityName = data.name;
                    var country = data.sys.country;
                    getWeather(lat, lon, cityName, country);
                    saveHistory(cityName, country);
                })
            } else {
                alert("Please enter a valid city name!");
            }
        })
        .catch (function(error) {
            alert("There was an error, please try again!");
        });
}

//call on onecall api to get weather from latitude and longitude
var getWeather = function (lat, lon, cityName, country) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;
    
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json()
                .then(function(data){
                    displayCurrent(data, cityName, country);
                    displayForecast(data);
                })
            } else {
                alert("There was an error, please try again!");
            }
        })
        .catch (function(error) {
            alert("There was an error, please try again!");
        });
}

// function to display current weather fetched from api onto display
var displayCurrent = function(data, cityName, country) {
    // get full date
    var theTime = new Date(data.current.dt * 1000);
    var fullDate = getDate(theTime);

    var weatherDivEl = document.createElement("div");
    weatherDivEl.className = "col-12 current-weather";

    var weatherHeadEl = document.createElement("h1");
    weatherHeadEl.textContent = cityName + ", " + country + " - " + fullDate;

    weatherDivEl.appendChild(weatherHeadEl);
    weatherDash.appendChild(weatherDivEl);

    displayWeather(data.current, weatherDivEl);
    displayUV(data.current.uvi, weatherDivEl);
};

var displayUV = function(uv, selected) {
    var uvi = parseInt(uv).toFixed(2);
    var uvEl = document.createElement("p");
    var conditions = "";

    if (uvi <= 2) {
        conditions = "favorable";
    } else if (uvi > 2 && uvi <= 6) {
        conditions = "moderate";
    } else {
        conditions = "severe";
    }

    uvEl.innerHTML = "UV Index: <span class ='conditions " + conditions + "'>" + uvi + "</span>";
    
    selected.appendChild(uvEl);
}
// function to display five-day forecast fetched from api onto display
var displayForecast = function(data) {
    for (i=1; i < 6; i++) {
        theTime = new Date(data.daily[i].dt*1000);
        fullDate = getDate(theTime);

        var weatherDivEl = document.createElement("div");
        weatherDivEl.className = "col-2 current-weather forecast";

        var weatherHeadEl = document.createElement("h1");
        weatherHeadEl.textContent = fullDate;

        weatherDivEl.appendChild(weatherHeadEl);
        weatherDash.appendChild(weatherDivEl);
        displayWeather(data.daily[i], weatherDivEl);
    }
}

// function to take the time and turn it into readable date
var getDate = function(theTime) {
    month = theTime.getMonth() + 1;
    date = theTime.getDate();
    year = theTime.getFullYear();

    var fullDate = month + "/" + date + "/" + year;
    return fullDate;
}

var getIcon = function(iconId) {
    iconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png";
    return iconUrl;
};

var displayWeather = function (datastatus, selected) {
    // get icon for weather
    var icon = getIcon(datastatus.weather[0].icon);

    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", icon);
    selected.appendChild(iconEl);

    // required metrics
    if(isNaN(datastatus.temp)) {
        var temp = "Temp: " + Math.round(datastatus.temp.day) + '\xB0';
    } else {
        var temp = "Temp: " + Math.round(datastatus.temp) + '\xB0';
    };
    var wind = "Wind: " + datastatus.wind_speed + " MPH";
    var humidity = "Humidity: " + datastatus.humidity + "%";
    var metrics = [temp, wind, humidity];
    
    var listEl = document.createElement("ul");
    
    for (var i = 0; i < metrics.length; i++) {
        var metric = metrics[i]; 
        var listItemEl = document.createElement("li");
        listItemEl.textContent = metric;
        listEl.appendChild(listItemEl);
    };
    
    selected.appendChild(listEl);

}

var saveHistory = function (cityName, country) {
    var history = cityName + ", " + country;

    // check if searched city name and country already exist in saved history to prevent duplicates
    if(searchHistory.indexOf(history) === -1) {
        searchHistory.push(history);
    };

    localStorage.setItem("city", JSON.stringify(searchHistory));
    displayHistory(searchHistory);
};

var displayHistory = function (searchHistory) {
    // clear history display
    historyDisplay.innerHTML = "";
    for (var i = 0; i < searchHistory.length; i++) {
        var historyBtnEl = document.createElement("button");
        historyBtnEl.textContent = searchHistory[i];
        historyBtnEl.className = "btn history-btn";
        historyBtnEl.setAttribute("id", "history-btn");
        historyBtnEl.addEventListener("click", buttonHandler)
        historyDisplay.appendChild(historyBtnEl);
    };
}

var loadHistory = function () {
    searchHistory = JSON.parse(localStorage.getItem("city"));
    
    if(!searchHistory) {
        searchHistory = [];
    }

    displayHistory(searchHistory);
};

formEl.addEventListener("submit", formHandler);

loadHistory();

