import React, { useState, useEffect, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";

function Searchbar({ onStockSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  // Correctly implemented debounce function using useCallback
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm) {
        setStockResults([]);
        setIsLoading(false);
        setShowNoResults(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.polygon.io/v3/reference/tickers?ticker=${searchTerm}&active=true&apiKey=kmBwNvupY5MSt6djXfLMtytNXEvxnmkx`
        );
        const data = await response.json();
        if (data.count === 0) {
          setShowNoResults(true);
          setStockResults([]);
        } else {
          setShowNoResults(false);
          setStockResults(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching stock results:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    if (showResults && searchTerm) { // Only trigger search when showResults is true and searchTerm is not empty
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch, showResults]);

  const handleStockSelect = (symbol) => {
    onStockSelect(symbol);
    setShowResults(false);
  };

  const handleSearchButtonClick = () => {
    setShowResults(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    setShowResults(false); // Hide results when input changes
  };

  return (
    <div className="mt-8">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search for a stock..."
          className="border border-gray-300 rounded-l-md py-2 px-4 block w-full"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md"
          onClick={handleSearchButtonClick}
        >
          Search
        </button>
      </div>
      {isLoading && showResults && (
        <div className="mt-2 text-gray-600">
          <FaSpinner className="animate-spin mr-2" /> Loading...
        </div>
      )}
      {!isLoading && showResults && (
        <>
          {showNoResults ? (
            <div className="mt-2 text-red-500">No results found</div>
          ) : (
            <ul className="mt-2 w-full">
              {stockResults.map((stock) => (
                <li
                  key={stock.ticker}
                  className="border-t border-gray-300 py-2 px-4 cursor-pointer"
                  onClick={() => handleStockSelect(stock.ticker)}
                >
                  <strong>{stock.ticker}</strong> - {stock.name}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

// Utility function to implement debounce
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export default Searchbar;
