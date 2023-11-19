import React, { useState, useEffect } from 'react';
import axios from 'axios'

const WeatherInfo = ({ capital }) => {
    const [weather, setWeather] = useState(null);

    console.log(capital)

    useEffect(() => {
        const api_key = import.meta.env.VITE_SOME_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`;
        console.log(url)
        axios.get(url)
            .then(response => {
                console.log('Weather data received:', response.data);
                setWeather(response.data)
            })
    }, []);

    console.log(weather)

    if (weather) {
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
        return (
            <div>
                <h3>Weather in {capital}</h3>
                <div>
                    <p>temperature {weather.main.temp} Celcius</p>
                    <img src={weatherIconUrl} alt={weather.weather[0].description} />
                    <p>wind {weather.wind.speed} m/s</p>
                </div>
            </div>
        );
    }

    return null;
};

export default WeatherInfo;