import React from 'react';

const SearchBar = ({ onSearch, placeholder = 'Pesquisar...' }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
