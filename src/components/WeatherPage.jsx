import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import sunnyIcon from '../assets/sunny3.jpg';
import rainyIcon from '../assets/rainyF.jpg';
import cloudyIcon from '../assets/cloudy1.jpg';
import defaultImg from '../assets/default.jpg';

const WeatherPage = () => {
  // State variables
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState('metric');
  const { city } = useParams();

  // Fetch weather data when component mounts or city/unit changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = '62c11a30b625a10b4a038000a78ffdad';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeatherData();
  }, [city, unit]);

  // Fetch forecast data when component mounts or city/unit changes
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const apiKey = '62c11a30b625a10b4a038000a78ffdad';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        console.log(data)
        setForecastData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchForecastData();
  }, [city]);

  // Function to handle unit change
  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  // If weather data is not yet fetched, display loading message
  if (!weatherData) {
    return <div>Loading...</div>;
  }

  // Determine weather icon based on weather data
  let weatherIcon;
  if (weatherData.weather[0].main === 'Clear') {
    weatherIcon = sunnyIcon;
  } else if (weatherData.weather[0].main === 'Rain') {
    weatherIcon = rainyIcon;
  } else if (weatherData.weather[0].main === 'Clouds') {
    weatherIcon = cloudyIcon;
  } else if (weatherData.weather[0].main === 'Thunderstorm') {
    weatherIcon = rainyIcon;
  } else {
    weatherIcon = defaultImg;
  }

  // Function to render forecast
  const renderForecast = () => {
    if (!forecastData) {
      return <div>Loading forecast...</div>;
    }

    //to change date format from forecast 
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      // Get the month and day
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      return `${month}/${day}`;
    };

      // Convert temperature from Celsius to Fahrenheit
  const convertToImperial = (temp) => {
    return (temp - 273.15) * 9/5 + 32;
  };

  // Convert temperature from Fahrenheit to Celsius
  const convertToMetric = (temp) => {
    return (temp - 273.15)
  };

      // Extract unique dates from the forecast data
    const uniqueDates = [...new Set(forecastData.list.map(item => item.dt_txt.split(' ')[0]))];

    return (
    <div className="mt-8 text-black bg-gray-400 bg-opacity-25 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Forecast for the next 6 days: {city}</h2>
      <div className="md:grid md:grid-cols-3 md:gap-4">
        {uniqueDates.slice(0, 6).map((date, index) => {
          // Find the forecast entry for the current date
          const forecast = forecastData.list.find(item => item.dt_txt.split(' ')[0] === date);
          return (
            <div key={index} className="border border-gray-300 p-4 rounded-lg mt-1  ">
              <p className="text-lg font-bold mb-2">Date: {formatDate(date)}</p>
              <p className="text-lg mb-2">Weather Desc: {forecast.weather[0].description}</p>
              <p className="text-lg mb-2">Temp: {unit === 'metric' ? convertToMetric(forecast.main.temp).toFixed(1) : convertToImperial(forecast.main.temp).toFixed(1)} {unit === 'metric' ? '°C' : '°F'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

  // Inline styles for background image
  const backgroundImageStyle = {
    backgroundImage: `url(${weatherIcon})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px',
    color: 'white',
  };

  return (
    <div style={backgroundImageStyle} className="p-8 rounded-lg shadow-xl ">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-center">Weather for : <span className='font-bold italic text-black underline'>{city}</span></h1>
      {/* Unit selection */}
      <div className="mb-4 flex items-center justify-center">
        <label className="block mb-2 text-lg" htmlFor="unit">Select Unit:</label>
        <select id="unit" value={unit} onChange={handleUnitChange} className="px-4 py-2 rounded-lg bg-transparent border border-black text-black ml-2">
          <option value="metric">Metric (°C)</option>
          <option value="imperial">Imperial (°F)</option>
        </select>
      </div>
      {/* Weather information */}
      <div className='text-black w-fit p-9 text-center ml-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-400 bg-opacity-25 rounded-lg '>
        <p className="text-lg border p-2 rounded-lg">Temp.: <span className="font-bold">{weatherData.main.temp}</span> {unit === 'metric' ? '°C' : '°F'}</p>
        <p className="text-lg border p-2 rounded-lg">Weather Desc.: <span className="font-bold">{weatherData.weather[0].description}</span></p>
        <p className="text-lg border p-2 rounded-lg">Humidity: <span className="font-bold">{weatherData.main.humidity}%</span></p>
        <p className="text-lg border p-2 rounded-lg">Wind Speed: <span className="font-bold">{weatherData.wind.speed}</span> m/s</p>
        <p className="text-lg border p-2 rounded-lg">Atmos. Press.: <span className="font-bold">{weatherData.main.pressure}</span> hPa</p>
        <p className="text-lg border p-2 rounded-lg">High Temp: <span className="font-bold">{weatherData.main.temp_max}</span></p>
        <p className="text-lg border p-2 rounded-lg">Low Temp: <span className="font-bold">{weatherData.main.temp_min}</span></p>
      </div>
      {/* Forecast */}
      {renderForecast()}
      {/* Link to Home */}
      <Link to="/" className="block mt-4 px-4 py-2 rounded border border-black hover:bg-blue-100 hover:text-black transition duration-300 text-center w-fit mx-auto">Go Back to Home</Link>
    </div>
  );
};

export default WeatherPage;
