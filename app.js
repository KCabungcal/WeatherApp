document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "YhdGqLyxb9o4kYTt2S34x9CGebSpHCX6";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchFiveDayForecast(locationKey);
                    fetchHourlyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = "<p>City not found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = "<p>Error fetching location data.</p>";
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = "<p>No weather data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = "<p>Error fetching weather data.</p>";
            });
    }

    function fetchFiveDayForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts) {
                    displayFiveDayForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += "<p>No 5-day forecast data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching 5-day forecast data:", error);
                weatherDiv.innerHTML += "<p>Error fetching 5-day forecast data.</p>";
            });
    }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML += "<p>No hourly forecast data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML += "<p>Error fetching hourly forecast data.</p>";
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayFiveDayForecast(data) {
        let forecastContent = "<h2>5-Day Forecast</h2>";
        data.forEach(day => {
            const date = new Date(day.Date).toLocaleDateString();
            const minTemp = day.Temperature.Minimum.Value;
            const maxTemp = day.Temperature.Maximum.Value;
            const weather = day.Day.IconPhrase;
            forecastContent += `
                <p>${date}: ${weather}, Min: ${minTemp}°C, Max: ${maxTemp}°C</p>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }

    function displayHourlyForecast(data) {
        let forecastContent = "<h2>Hourly Forecast (Next 1 Hour)</h2>";
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString();
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            forecastContent += `
                <p>${time}: ${weather}, Temp: ${temperature}°C</p>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }
});
