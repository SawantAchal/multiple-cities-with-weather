import React from 'react';

// FavoriteButton component renders a button to add or remove a city from favorites
const FavoriteButton = ({ city, isFavorite, onToggle }) => {
  return (
    // Button to toggle favorite status
    <button onClick={() => onToggle(city)} className="text-red-500 hover:text-red-700" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
      {/* Display heart emoji if city is favorite, otherwise display white heart emoji */}
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;
