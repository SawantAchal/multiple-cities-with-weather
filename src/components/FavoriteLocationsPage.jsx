import React, { useState, useEffect } from 'react';
import FavoriteButton from './FavoriteButton';

const FavoriteLocationsPage = () => {
  // State to manage favorite locations
  const [favorites, setFavorites] = useState([]);

  // Effect hook to load favorites from localStorage when the component mounts
  useEffect(() => {
    // Fetch favorite cities from localStorage or database
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Function to handle adding/removing favorites
  const handleFavoriteToggle = (city) => {
    // Check if the city is already in favorites
    const isFavorite = favorites.includes(city);

    if (isFavorite) {
      // Remove city from favorites
      const updatedFavorites = favorites.filter((favCity) => favCity !== city);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      // Add city to favorites
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-4 text-center">Favorite Locations</h1>
      <div className="overflow-x-auto">
        {/* Table to display favorite locations */}
        <table className="min-w-full divide-y divide-gray-200 border border-black">
          <thead className="bg-gray-50">
            <tr>
              {/* Table headers */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Favorite</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Map through favorite cities to render table rows */}
            {favorites.map((city, index) => (
              <tr key={index}>
                {/* Display city name */}
                <td className="px-6 py-4 whitespace-nowrap">{city}</td>
                {/* Display favorite button */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <FavoriteButton city={city} isFavorite={true} onToggle={handleFavoriteToggle} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FavoriteLocationsPage;
