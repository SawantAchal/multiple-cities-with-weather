import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import L from 'leaflet';
import sunnyIcon from '../assets/sunny3.jpg';
import rainyIcon from '../assets/rainyF.jpg';
import cloudyIcon from '../assets/cloudy1.jpg';
import defaultImg from '../assets/default.jpg'

const WeatherPage = () => {
  // States to manage weather data, unit of measurement, and map
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [map, setMap] = useState(null);
  // Extract city parameter from URL
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

  // Display map when weather data is available
  useEffect(() => {
    if (weatherData) {
      displayMap();
    }
  }, [weatherData]);

  // Disable body overflow when component mounts and re-enable when unmounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  // Function to display map using Leaflet
  const displayMap = () => {
    if (!map) {
      const map = L.map('map').setView([weatherData.coord.lat, weatherData.coord.lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.marker([weatherData.coord.lat, weatherData.coord.lon]).addTo(map).bindPopup(city).openPopup();
      setMap(map);
    }
  };

  // Function to handle unit change
  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  // If weather data is not yet fetched, display loading message
  if (!weatherData) {
    return <div>Loading...</div>;
  }

  // Define weather condition icon based on weather data
  let weatherIcon;
  if (weatherData.weather[0].main === 'Clear') {
    weatherIcon = sunnyIcon;
  } else if (weatherData.weather[0].main === 'Rain') {
    weatherIcon = rainyIcon;
  } else if (weatherData.weather[0].main === 'Clouds') {
    weatherIcon = cloudyIcon;
  }else {
    weatherIcon = defaultImg
  }

  // Inline styles for background image
  const backgroundImageStyle = {
    backgroundImage: `url(${weatherIcon})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px',
    color: 'white',
  };

  // Render weather information
  return (
    <div style={backgroundImageStyle} className="p-8 rounded-lg shadow-xl ">
      <h1 className="text-3xl font-bold mb-4 text-center">Weather for : <span className='font-bold italic text-black underline'>{city}</span></h1>
      <div>
        <div className="mb-4 flex items-center">
          {/* Unit selection dropdown */}
          <label className="block mb-2 text-lg text-center" htmlFor="unit">Select Unit:</label>
          <select id="unit" value={unit} onChange={handleUnitChange} className="px-4 py-2 rounded-lg bg-transparent border border-black text-black ml-2">
            <option value="metric">Metric (°C)</option>
            <option value="imperial">Imperial (°F)</option>
          </select>
        </div>
        {/* Display weather information */}
        <div className='text-black w-fit  p-2 text-center ml-4'>
          <p className="text-lg border p-2 rounded-lg">Temperature: <span className="font-bold">{weatherData.main.temp}</span> {unit === 'metric' ? '°C' : '°F'}</p>
          <p className="text-lg border p-2 rounded-lg mt-2">Weather Description: <span className="font-bold">{weatherData.weather[0].description}</span></p>
          <p className="text-lg border p-2 rounded-lg mt-2">Humidity: <span className="font-bold">{weatherData.main.humidity}%</span></p>
          <p className="text-lg border p-2 rounded-lg mt-2">Wind Speed: <span className="font-bold">{weatherData.wind.speed}</span> m/s</p>
          <p className="text-lg border p-2 rounded-lg mt-2">Atmospheric Pressure: <span className="font-bold">{weatherData.main.pressure}</span> hPa</p>
          <p className="text-lg border p-2 rounded-lg mt-2">High Temperature: <span className="font-bold">{weatherData.main.temp_max}</span></p>
          <p className="text-lg border p-2 rounded-lg mt-2">Low Temperature: <span className="font-bold">{weatherData.main.temp_min}</span></p>
        <Link to="/" className="block mt-4 px-4 py-2 rounded border border-black hover:bg-blue-100  hover:text-black transition duration-300 text-center w-fit">Go Back to Home</Link>

        </div>
      </div>
      {/* Render map */}
      <div id="map" className="mt-8 hidden md:block" style={{ height: '400px' }} ></div>
    </div>
  );
};

export default WeatherPage;
