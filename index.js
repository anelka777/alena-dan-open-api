function interpretWeatherCode(code) {
    const weatherConditions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Drizzle: Light',
        53: 'Drizzle: Moderate',
        55: 'Drizzle: Dense intensity',
        56: 'Freezing Drizzle: Light',
        57: 'Freezing Drizzle: Dense intensity',
        61: 'Rain: Slight',
        63: 'Rain: Moderate',
        65: 'Rain: Heavy intensity',
        66: 'Freezing Rain: Light',
        67: 'Freezing Rain: Heavy intensity',
        71: 'Snow fall: Slight',
        73: 'Snow fall: Moderate',
        75: 'Snow fall: Heavy intensity',
        80: 'Rain showers: Slight',
        81: 'Rain showers: Moderate',
        82: 'Rain showers: Violent',
        85: 'Snow showers slight',
        86: 'Snow showers heavy',
        95: 'Thunderstorm: Slight or moderate',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    
    return weatherConditions[code] || 'Unknown weather condition';
}

function getWeatherImagePath(code) {
    const weatherImages = {
        0: 'sunny.png', //+
        1: 'mainly_clear.png', //+
        2: 'partly_cloudly.png', //+
        3: 'overcast.png', // +
        45: 'fog.png', // +
        48: 'rime_fog.png',
        51: 'drizzle_light.png', // +
        53: 'drizzle_moderate.png', // +
        55: 'drizzle_dense.png', // +
        56: 'light_freezing_drizzle.png',
        57: 'dense_freezing_drizzle.png',
        61: 'rain_slight.png', //+
        63: 'rain_moderate.png', //+
        65: 'rain_heavy.png', //+
        66: 'light_freezing_rain.png',
        67: 'heavy_freezing_rain.png',
        71: 'slight_snow.png',
        73: 'moderate_snow.png',
        75: 'heavy_snow.png',
        80: 'rain_showers_slight.png',
        81: 'rain_showers_moderate.png',
        82: 'rain_showers_violent.png',
        85: 'slight_snow_showers.png',
        86: 'heavy_snow_showers.png',
        95: 'thunderstorm.png',
        96: 'thunderstorm_with_slight_hail.png',
        99: 'thunderstorm_with_heavy_hail.png',
    };

    return weatherImages[code] || 'default.png';
}

function updateWeatherDisplay(time, temperature, weatherCode) {
    const date = time.toLocaleDateString('en-US');
    const dayOfWeek = time.toLocaleDateString('en-US', { weekday: 'long' });
    const weatherCondition = interpretWeatherCode(weatherCode);
    const weatherImagePath = getWeatherImagePath(weatherCode);

    document.getElementById('date_now').innerHTML = `<strong>Date:</strong> ${date}`;
    document.getElementById('weekday_now').innerHTML = `<strong>Weekday:</strong> ${dayOfWeek}`;
    document.getElementById('temperature_now').innerHTML = `<strong>Temperature:</strong> ${temperature} °F`;
    document.getElementById('weather_condition_now').innerHTML = `<strong>Weather Condition:</strong> ${weatherCondition}`;
    document.getElementById('weather_image_now').src = `./images/${weatherImagePath}`;
}

function updateTomorrowWeatherDisplay(time, temperature, weatherCode) {
    const date = time.toLocaleDateString('en-US');
    const dayOfWeek = time.toLocaleDateString('en-US', { weekday: 'long' });
    const weatherCondition = interpretWeatherCode(weatherCode);
    const weatherImagePath = getWeatherImagePath(weatherCode);

    document.getElementById('date_tommorow').innerHTML = `<strong>Date:</strong> ${date}`;
    document.getElementById('weekday_tommorow').innerHTML = `<strong>Weekday:</strong> ${dayOfWeek}`;
    document.getElementById('temperature_tommorow').innerHTML = `<strong>Temperature:</strong> ${temperature} °F`;
    document.getElementById('weather_condition_tommorow').innerHTML = `<strong>Weather Condition:</strong> ${weatherCondition}`;
    document.getElementById('weather_image_tommorow').src = `./images/${weatherImagePath}`;
}

async function fetchData() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.5816&longitude=-121.4944&current_weather=true&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles');
        if (!response.ok) {
            throw new Error('Request failed');
        }

        const data = await response.json();
        const timeNow = new Date(data.current_weather.time);
        const temperatureNow = data.current_weather.temperature;
        const weatherCodeNow = data.current_weather.weathercode;
        const timeTomorrow = new Date(data.daily.time[2]);
        const temperatureTomorrow = data.daily.temperature_2m_max[2];
        const weatherCodeTomorrow = data.daily.weather_code[2];

        updateWeatherDisplay(timeNow, temperatureNow, weatherCodeNow);
        updateTomorrowWeatherDisplay(timeTomorrow, temperatureTomorrow, weatherCodeTomorrow);

        document.getElementById('toggle-button').addEventListener('click', function() {
            const currentWeatherDiv = document.getElementById('current-weather');
            const tomorrowWeatherDiv = document.getElementById('tomorrow-weather');
            const header = document.getElementById('weather-header');

            if (currentWeatherDiv.classList.contains('hidden')) {
                currentWeatherDiv.classList.remove('hidden');
                tomorrowWeatherDiv.classList.add('hidden');
                this.textContent = 'Show Tomorrow\'s Weather';
                header.textContent = 'Weather Now:';
            } else {
                currentWeatherDiv.classList.add('hidden');
                tomorrowWeatherDiv.classList.remove('hidden');
                this.textContent = 'Show Current Weather';
                header.textContent = 'Weather Tomorrow:';
            }
        });

        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';

        const currentDay = new Date(data.daily.time[1]).getDate();
        for (let i = 1; i < data.daily.time.length && i <= 7; i++) {
            const week = new Date(data.daily.time[i]);
            if (week.getDate() !== currentDay) {
                const weekDate = week.toLocaleDateString('en-US');
                const weekDay = week.toLocaleDateString('en-US', { weekday: 'long' });
                const maxTemp = data.daily.temperature_2m_max[i];
                const minTemp = data.daily.temperature_2m_min[i];
                const weatherCode = data.daily.weather_code[i];
                const weatherCondition = interpretWeatherCode(weatherCode);
                const weatherImagePath = getWeatherImagePath(weatherCode);
                const forecastItem = document.createElement('div');
                forecastItem.className = 'forecast-item';
                forecastItem.innerHTML = `
                    <strong>${weekDay}, ${weekDate}</strong><br>
                    <strong>Max:</strong> ${maxTemp} °F / <strong>Min:</strong> ${minTemp} °F<br>
                    <strong>Condition:</strong> ${weatherCondition}<br>
                    <img src="./images/${weatherImagePath}" alt="Weather condition" width="50px"><br>
                `;
                forecastContainer.appendChild(forecastItem);
            }
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

fetchData();