import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import bgHome from '../assets/home2.gif';

const CityTable = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [sortOrder, setSortOrder] = useState('ascending');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&refine=timezone%3A%22Asia%22&refine=cou_name_en%3A%22India%22')

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const results = data.results;

        const cityNames = results.map(result => result.ascii_name);
        const countryNames = results.map(result => result.cou_name_en);
        const timeZoneNames = results.map(result => result.timezone);

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

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  const handleCityClick = (e, city) => {
    if (e.button === 0) {
      return;
    } else if (e.button === 1 || e.button === 2) {
      window.open(`/weather/${city}`, '_blank');
    }
  };

  const handleFavoriteToggle = (city) => {
    if (favorites.includes(city)) {
      setFavorites(favorites.filter(fav => fav !== city));
    } else {
      setFavorites([...favorites, city]);
    }
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedCities = () => {
    const sortableCities = [...filteredCities];
    sortableCities.sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return sortOrder === 'ascending' ? -1 : 1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return sortOrder === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableCities;
  };

  return (
    <div className="city-table-container bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgHome})` }}>
      <div className="container mx-auto p-4 bg-white bg-opacity-40 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-4 text-center">LIST OF CITIES</h1>
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <label htmlFor="sortOrder" className="font-bold text-lg">Sort Cities:</label>
            <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange} className="border border-black rounded px-2 py-1">
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
          <input type='text' placeholder='Search for a city...' value={searchQuery} onChange={handleSearchChange} className="border border-gray-300 rounded px-4 py-2 mb-4 lg:mb-0" />
          <Link to="/favorite" className="py-2 px-4 font-bold rounded border border-black hover:bg-blue-100  hover:text-black transition duration-300" style={{ textDecoration: 'none' }}>Favorite Locations</Link>
        </div>
        <div className="overflow-x-auto">
          {filteredCities.length > 0 ? (
            <table className="min-w-full divide-y divide-black bg-transparent">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-gray-950 uppercase tracking-wider">City Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-gray-950 uppercase tracking-wider">Country</th>
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-gray-950 uppercase tracking-wider">Time Zone</th>
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-gray-950 uppercase tracking-wider">Favorite</th>
                </tr>
              </thead>
              <tbody>
                {sortedCities().map((city, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap uppercase ">
                      <Link to={`weather/${city}`} onClick={(e) => handleCityClick(e, city)} className="text-black font-bold hover:underline">{city}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{countries[index]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{timeZones[index]}</td>
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



