import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import bgHome from '../assets/home2.gif'

const CityTable = () => {
  // States to manage cities, countries, time zones, filtered cities, search query, and favorites
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Fetch city data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&refine=timezone%3A%22Asia%22&refine=cou_name_en%3A%22India%22')

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const results = data.results;

        // Extract city names, country names, and time zones from the results
        const cityNames = results.map(result => result.ascii_name);
        const countryNames = results.map(result => result.cou_name_en);
        const timeZoneNames = results.map(result => result.timezone);

        // Set states with fetched data
        setCities(cityNames);
        setCountries(countryNames);
        setTimeZones(timeZoneNames);
        setFilteredCities(cityNames);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredCities(cities); 
    } else {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  // Function to handle city click
  const handleCityClick = (e, city) => {
    if (e.button === 0) {
      // Left click: Navigate to weather page in the same tab
      return;
    } else if (e.button === 1 || e.button === 2) {
      // Middle click or right click: Open weather page in a new tab
      window.open(`/weather/${city}`, '_blank');
    }
  };

  // Function to handle adding/removing favorites
  const handleFavoriteToggle = (city) => {
    if (favorites.includes(city)) {
      setFavorites(favorites.filter(fav => fav !== city));
      // Remove city from favorites in local storage
      localStorage.setItem('favorites', JSON.stringify(favorites.filter(fav => fav !== city)));
    } else {
      setFavorites([...favorites, city]);
      // Add city to favorites in local storage
      localStorage.setItem('favorites', JSON.stringify([...favorites, city]));
    }
  };

  // Render the city table component
  return (
    <div className="city-table-container bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgHome})` }}>
      <div className="container mx-auto p-4 bg-white bg-opacity-75 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-4 text-center">LIST OF CITIES</h1>
        <div className="flex justify-evenly mb-4">
          {/* Search input */}
          <input type='text' placeholder='Search for a city...' value={searchQuery} onChange={handleSearchChange} className="border border-gray-300 rounded px-4 py-2" />
          {/* Link to favorite locations page */}
          <Link to="/favorite" className="block ml-4 py-2 px-4 text-blue-500 font-bold rounded border border-blue-500 hover:bg-blue-100 hover:border-blue-700 hover:text-black transition duration-300" style={{ textDecoration: 'none' }}>Favorite Locations</Link>
        </div>
        <div className="overflow-x-auto">
          {/* Render table of filtered cities */}
          {filteredCities.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 bg-transparent">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-950 uppercase tracking-wider">City Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-950 uppercase tracking-wider">Country</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-950 uppercase tracking-wider">Time Zone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-950 uppercase tracking-wider">Favorite</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through filtered cities to render table rows */}
                {filteredCities.map((city, index) => (
                  <tr key={index}>
                    {/* City name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`weather/${city}`} onClick={(e) => handleCityClick(e, city)} className="text-blue-500 hover:underline">{city}</Link>
                    </td>
                    {/* Country */}
                    <td className="px-6 py-4 whitespace-nowrap">{countries[index]}</td>
                    {/* Time zone */}
                    <td className="px-6 py-4 whitespace-nowrap">{timeZones[index]}</td>
                    {/* Favorite button */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <FavoriteButton city={city} isFavorite={favorites.includes(city)} onToggle={handleFavoriteToggle} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-600">No cities found for the search query.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityTable;
