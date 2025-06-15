import React, { createContext, useContext, useState } from 'react';

// Create Search Context
const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchActive(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearchActive(term.length > 0);
  };

  const value = {
    searchTerm,
    isSearchActive,
    setSearchTerm: handleSearch,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
