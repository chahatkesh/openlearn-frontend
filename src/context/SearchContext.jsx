import React, { useState } from 'react';
import { SearchContext } from '../hooks/useSearch';

const SearchProvider = ({ children }) => {
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

export { SearchProvider };
export default SearchProvider;
