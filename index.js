
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


async function fetchData() {
    try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles');
    
    if (!response.ok) {
    throw new Error('Request failed');
    }

    const data = await response.json();
    
    const time = data.current_weather.time;
    const temperature = data.current_weather.temperature;
    const weatherCode = data.current_weather.weathercode;

    console.log(data);
    console.log(`Time: ${time}`);
    console.log(`Temperature:${temperature}°F`);
    console.log(`Weather Condition Code: ${weatherCode}`);
    
    const weatherCondition = interpretWeatherCode(weatherCode);
    console.log(`Weather Condition: ${weatherCondition}`);

    const displayTime = document.getElementById('time');
    const displayTemperature = document.getElementById('temperature');
    const displayWeatherCondition = document.getElementById('weather_condition');
    displayTime.innerHTML = `<strong>Date and Time:</strong> ${time}`;
    displayTemperature.innerHTML = `<strong>Temperature:</strong> ${temperature} °F`;
    displayWeatherCondition.innerHTML = `<strong>Weather Condition:</strong> ${weatherCondition}`;


    } catch (error) {
    console.error('An error occurred:', error);
    }
}

fetchData();

