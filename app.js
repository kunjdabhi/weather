'use strict'

const apiKey = 'e5f98536ab5c8255b3d8f92ceca77da9';
const windDeg = document.getElementById('wind-deg');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const cloudiness = document.getElementById('cloudiness');
const dewPoints = document.getElementById('dewPoints');
const temp = document.getElementById('temprature');
const currDate = document.getElementById('current-date');
const currTime = document.getElementById('current-time');
const currLocation = document.getElementById('current-location');
const mainContainer = document.querySelector('.main');
const container = document.querySelector('.container-fluid');


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


const getLocation = function () {
    const position = navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        getWeather(latitude, longitude);

    }, () => {
        console.log('failed to get your location')
    });

}

getLocation();


const getWeather = async function (latitude, longitude) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}8&lon=${longitude}&exclude=hourly,minutely&appid=${apiKey}`);
    const data = await response.json();
    setWeather(data);
    getCity(latitude,longitude);
}
const getCity = async function (latitude, longitude) {
    try {
        const responseCity = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
        const dataCity = await responseCity.json();
        if (dataCity?.success == false) {
            currLocation.textContent = 'API error';
        } else
            currLocation.textContent = `${dataCity.city}, ${dataCity.state}`;
    } catch (error) {
        console.error(error)
    }
}

const setWeather = function (data) {

    windDeg.textContent = data.current.wind_deg;
    windSpeed.textContent = data.current.wind_speed;
    temp.textContent = `${(data.current.temp - 273).toFixed(2)} ℃`;
    cloudiness.textContent = data.current.clouds;
    humidity.textContent = data.current.humidity;
    dewPoints.textContent = data.current.dew_point;
    const dateAndTime = new Date();
    const date = dateAndTime.getDate();
    const month = dateAndTime.getMonth();
    const year = dateAndTime.getFullYear();
    currDate.textContent = `${date}, ${months[month]} ${year}`

    setInterval(() => {
        const now1 = new Date();
        const minute = `${now1.getMinutes()}`;
        const hour = `${now1.getHours()}`;
        const second = `${now1.getSeconds()}`;
        currTime.textContent = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`
        if (hour >= 20 || hour <= 7) {
            container.style.background = 'linear-gradient(315deg, #2f4353 0%, #d2ccc4 74%)'
            mainContainer.style.background = 'linear-gradient(to top, #414345, #232526)'
            mainContainer.style.color = 'white'
        } else {
            container.style.background = 'linear-gradient(to left, #E1F5C4, #EDE574)'
            mainContainer.style.background = 'linear-gradient(to right, #ffd194, #70e1f5)';
            mainContainer.style.color = 'black'
        }
    }, 1000);

}

