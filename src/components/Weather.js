import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const storeRecent = localStorage.getItem('recent');
    if(storeRecent) {
      setRecent(JSON.parse(storeRecent));
    }
  }, [])

  const cityNameChange = (e) => {
    setCity(e.target.value);
  };

  const getWeather = async (e) => {
    e.preventDefault();

    setCity('');

    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;

      const response = await fetch(url);

      if(!response.ok) {
        throw new Error('도시를 찾을 수 없습니다.');
      }

      const data = await response.json();
      setWeather(data);
      setError(null);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 18) return 'morning'; // 오전 5시~11시
    else return 'night'; // 저녁 6시~새벽 4시
  };

  const timeOfDay = getTimeOfDay();

  const backgroundImageMap = {
    morning: 'url(/images/morning.jpg)',
    night: 'url(/images/night.jpg)',
  };

  const weatherStyle = {
    backgroundImage: backgroundImageMap[timeOfDay],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const recentUpdate = () => {
    if (!weather.name) return;

    const updatedRecent = [...recent];

    const exists = updatedRecent.find(city => city.name === weather.name);

    if (exists) {
      const filteredRecent = updatedRecent.filter(city => city.name !== weather.name);
      setRecent(filteredRecent);
      localStorage.setItem('recent', JSON.stringify(filteredRecent));
    } else {
      const newCity = {id: uuidv4(), name: weather.name};
      updatedRecent.push(newCity);
      setRecent(updatedRecent);
      localStorage.setItem('recent', JSON.stringify(updatedRecent));
    }

    console.log(updatedRecent);
  };

  const getWeatherName = async (city) => {
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;

      const response = await fetch(url);

      if(!response.ok) {
        throw new Error('도시를 찾을 수 없습니다.');
      }

      const data = await response.json();
      setWeather(data);
      setError(null);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  return (
    <>
      <div className='search-wrap'>
        <form onSubmit={getWeather}>
          <h2 className='search-wrap--title'>도시 명</h2>
          <p className='search-wrap--text'>영문으로 입력해주세요.</p>
          <input className='search-wrap__input'
            type='text'
            placeholder='도시명을 입력하세요.'
            onChange={cityNameChange}
            value={city}
          />
          <button className='search-wrap__button'>Search</button>
        </form>
        {recent.map((recentItem) => (
          <span key={recentItem.id} className='recent-list' onClick={() => getWeatherName(recentItem.name)}>{recentItem.name}</span>
        ))}
      </div>

      {error && <p className='error'>{error}</p>}
      {weather && (
        <div className='weather-wrap' style={weatherStyle}>
          <span className='weather-wrap__button' onClick={recentUpdate}>
            {recent.find(city => city.name === weather.name) ? '★' : '☆'}
          </span>
          <h2 className='weather-wrap--title'>{weather.name}</h2>
          <p className='weather-wrap--weather'>{weather.weather[0].description}</p>
          <p className='weather-wrap--temp'>{weather.main.temp}°</p>
        </div>
      )}
    </>
  );
};

export default Weather;