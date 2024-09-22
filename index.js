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

function getWeatherImagePath(code, isDay) {
    const weatherImagesDay = {
        0: 'sunny.png', //+
        1: 'mainly_clear.png', //+
        2: 'partly_cloudy.png', //+
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
        80: 'rain_showers_slight.png', // -
        81: 'rain_showers_moderate.png', // -
        82: 'rain_showers_violent.png', // -
        85: 'slight_snow_showers.png',
        86: 'heavy_snow_showers.png',
        95: 'thunderstorm.png', // -
        96: 'thunderstorm_with_slight_hail.png', // -
        99: 'thunderstorm_with_heavy_hail.png', // -
    };


    const weatherImagesNight = {
        0: 'night_clear.png',
        1: 'night_mainly_clear.png',
        2: 'night_partly_cloudy.png',
        3: 'night_overcast.png',
    };

    return isDay ? weatherImagesDay[code] || 'default.png' : weatherImagesNight[code] || 'default_night.png';

}

function updateWeatherDisplay(time, temperature, weatherCode, isDay) {
    const date = time.toLocaleDateString('en-US');
    const dayOfWeek = time.toLocaleDateString('en-US', { weekday: 'long' });
    const weatherCondition = interpretWeatherCode(weatherCode);
    const weatherImagePath = getWeatherImagePath(weatherCode, isDay);

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
    const weatherImagePath = getWeatherImagePath(weatherCode, true);

    document.getElementById('date_tomorrow').innerHTML = `<strong>Date:</strong> ${date}`;
    document.getElementById('weekday_tomorrow').innerHTML = `<strong>Weekday:</strong> ${dayOfWeek}`;
    document.getElementById('temperature_tomorrow').innerHTML = `<strong>Temperature:</strong> ${temperature} °F`;
    document.getElementById('weather_condition_tomorrow').innerHTML = `<strong>Weather Condition:</strong> ${weatherCondition}`;
    document.getElementById('weather_image_tomorrow').src = `./images/${weatherImagePath}`;
}

function displayHourlyWeather(hourlyTime, hourlyTemperature, hourlyWeatherCode) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentHourIndex = hourlyTime.findIndex(time => new Date(time).getHours() === currentHour);        
    const hourlyContainer = document.getElementById('today-hourly');
    hourlyContainer.innerHTML = '';

    hourlyTime.slice(currentHourIndex, currentHourIndex + 12).forEach((time, i) => {
        const formattedTime = new Date(time).toLocaleTimeString([], { hour: 'numeric', hour12: true });
        const temperature = hourlyTemperature[currentHourIndex + i];
        const weatherCondition = interpretWeatherCode(hourlyWeatherCode[currentHourIndex + i]);
        const isDayHour = new Date(time).getHours() >= 6 && new Date(time).getHours() < 18; // it is Day or Night
        const weatherImagePath = getWeatherImagePath(hourlyWeatherCode[currentHourIndex + i], isDayHour);
        const dayNightText = isDayHour ? 'Day' : 'Night';

        hourlyContainer.innerHTML += `
            <div class="forecast-item">
                <strong>${formattedTime}</strong><br>
                <strong>Temperature:</strong> ${temperature} °F<br>
                <strong>Condition:</strong> ${weatherCondition}<br>
                <strong>${dayNightText} time </strong><br>
                <img src="./images/${weatherImagePath}" alt="Weather condition" width="45px"><br>
            </div>
        `;
    });
}


document.addEventListener('DOMContentLoaded', function() {
    async function fetchData() {
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.5816&longitude=-121.4944&current=temperature_2m,is_day,weather_code&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles&forecast_days=14&forecast_hours=24');
            if (!response.ok) {
                throw new Error('Request failed');
            }

            const data = await response.json();
            console.log(data);

            const timeNow = new Date(data.current.time);
            console.log("timeNow:", timeNow);
            const temperatureNow = data.current.temperature_2m;
            const weatherCodeNow = data.current.weather_code;

            const timeTomorrow = new Date(data.daily.time[2]);
            timeTomorrow.setHours(timeTomorrow.getHours() + 6); /*правильно*/
            console.log("timeTomorrow:", timeTomorrow);
            const temperatureTomorrow = data.daily.temperature_2m_max[2];
            const weatherCodeTomorrow = data.daily.weather_code[2];

            const hourlyTime = data.hourly.time;
            const hourlyTemperature = data.hourly.temperature_2m;
            const hourlyWeatherCode = data.hourly.weather_code;


            const isDayNow = timeNow.getHours() >= 6 && timeNow.getHours() < 18;
            console.log(isDayNow)
            updateWeatherDisplay(timeNow, temperatureNow, weatherCodeNow, isDayNow);
            updateTomorrowWeatherDisplay(timeTomorrow, temperatureTomorrow, weatherCodeTomorrow);
            displayHourlyWeather(hourlyTime, hourlyTemperature, hourlyWeatherCode);


            document.getElementById('toggle-button').addEventListener('click', function() {
                const currentWeatherDiv = document.getElementById('current-weather');
                const tomorrowWeatherDiv = document.getElementById('tomorrow-weather');
                const header = document.getElementById('weather-header');
                if (currentWeatherDiv.classList.contains('hidden')) {
                    currentWeatherDiv.classList.remove('hidden');
                    tomorrowWeatherDiv.classList.add('hidden');
                    this.textContent = 'Show Tomorrow\'s Weather';
                    header.textContent = 'Now:'; 
                } else {
                    currentWeatherDiv.classList.add('hidden');
                    tomorrowWeatherDiv.classList.remove('hidden');
                    this.textContent = 'Show Current Weather';
                    header.textContent = 'Tomorrow:';
                }
            });

            function toggleVisibility(button, contentDiv, header, showText, hideText, headerText) {
                if (contentDiv.classList.contains('hidden')) {
                    contentDiv.classList.remove('hidden');
                    header.classList.remove('hidden');
                    button.textContent = hideText;
                    if (headerText) header.textContent = headerText;
                } else {
                    contentDiv.classList.add('hidden');
                    header.classList.add('hidden');
                    button.textContent = showText;
                }
            }
            
            document.getElementById('toggle-button-hourly').addEventListener('click', function() {
                const hourlyWeatherDiv = document.getElementById('today-hourly');
                const hourlyHeader = document.getElementById('weather-header-hourly');
                toggleVisibility(this, hourlyWeatherDiv, hourlyHeader, 
                    'Show Today\'s Weather Hourly', 'Hide Today\'s Weather Hourly', 'Hourly:');
            });
            
            document.getElementById('toggle-button-daily').addEventListener('click', function() {
                const dailyWeatherDiv = document.getElementById('forecast');
                const dailyHeader = document.getElementById('weather-header-daily');
                toggleVisibility(this, dailyWeatherDiv, dailyHeader, 
                    'Show Weather Daily', 'Hide Weather Daily', 'Daily:');
            })

            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = '';
            const currentDay = new Date(data.daily.time[0]).getDate();
            
            for (let i = 2; i < data.daily.time.length && i <= 8; i++) {
                const week = new Date(data.daily.time[i]);
                if (week.getDate() !== currentDay) {
                    const weekDate = week.toLocaleDateString('en-US');
                    const weekDay = week.toLocaleDateString('en-US', { weekday: 'long' });
                    const maxTemp = data.daily.temperature_2m_max[i];
                    const minTemp = data.daily.temperature_2m_min[i];
                    const weatherCode = data.daily.weather_code[i];
                    const weatherCondition = interpretWeatherCode(weatherCode);
                    const weatherImagePath = getWeatherImagePath(weatherCode, true);
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
});

    // ============= footer==================
    const today = new Date();
    const thisYear = today.getFullYear();
    const footer = document.createElement('footer');
    const body = document.querySelector('body');
    body.appendChild(footer);
    const copyright = document.createElement('p');
    copyright.innerHTML = `&copy; Alena Danilchenko ${thisYear}`;
    footer.appendChild(copyright);

    