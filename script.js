// Replace this with the API key you get from OpenWeatherMap
const apiKey = '3cfc725862442aeb530385180c42eede';

// Base URL for the OpenWeather current weather endpoint
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const cityName = document.getElementById('cityName');
const countryName = document.getElementById('countryName');
const weatherIcon = document.getElementById('weatherIcon');
const tempValue = document.querySelector('.temp h1');
const tempDescription = document.querySelector('.temp p');
const humidityValue = document.querySelector('.col .value');
const windValue = document.querySelectorAll('.col .value')[1];

async function fetchWeather(city) {
    if (apiKey === 'YOUR_API_KEY_HERE') {
        alert('Please replace YOUR_API_KEY_HERE in script.js with your OpenWeatherMap API key.');
        return;
    }

    const url = `${apiBaseUrl}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const message = errorData?.message || response.statusText || 'Unable to fetch weather';
            throw new Error(message);
        }
        const data = await response.json();
        updateWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    if (apiKey === 'YOUR_API_KEY_HERE') {
        alert('Please replace YOUR_API_KEY_HERE in script.js with your OpenWeatherMap API key.');
        return;
    }

    const url = `${apiBaseUrl}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const message = errorData?.message || response.statusText || 'Unable to fetch weather';
            throw new Error(message);
        }
        const data = await response.json();
        updateWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

function updateWeather(data) {
    cityName.textContent = data.name;
    countryName.textContent = data.sys.country;
    tempValue.textContent = `${Math.round(data.main.temp)}°C`;
    tempDescription.textContent = data.weather[0].description;
    humidityValue.textContent = `${data.main.humidity}%`;
    windValue.textContent = `${data.wind.speed} km/h`;
    // Prefer local icons from the images/ folder, fall back to OpenWeather icon
    const weatherMain = data.weather[0].main || '';
    const iconCode = data.weather[0].icon || '';
    const localMap = {
        Rain: 'images/rain.png',
        Drizzle: 'images/drizzle.png',
        Clouds: 'images/clouds.png',
        Clear: 'images/clear.png',
        Snow: 'images/snow.png',
        Mist: 'images/mist.png',
        Fog: 'images/fog.svg',
        Haze: 'images/mist.png',
        Thunderstorm: 'images/thunder.svg',
        Smoke: 'images/unknown.svg',
        Dust: 'images/unknown.svg'
    };

    const localIcon = localMap[weatherMain] || null;
    if (localIcon) {
        weatherIcon.src = localIcon;
    } else if (iconCode) {
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    } else {
        weatherIcon.src = 'images/unknown.svg';
    }
    weatherIcon.alt = data.weather[0].description || weatherMain;
    weatherCard.classList.add('active');
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// Quick-select preset city buttons
document.querySelectorAll('.city-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const city = btn.dataset.city;
        cityInput.value = city;
        const lat = btn.dataset.lat;
        const lon = btn.dataset.lon;
        if (lat && lon) {
            fetchWeatherByCoords(lat, lon);
        } else {
            fetchWeather(city);
        }
    });
});