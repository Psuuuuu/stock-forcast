import React, { useState, useEffect, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";

function Searchbar({ onStockSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(true);

  // Correctly implemented debounce function using useCallback
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm) {
        setStockResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=UGL2A2KIJPXJE303`
        );
        const data = await response.json();
        console.log(data);
        setStockResults(data.bestMatches || []);
      } catch (error) {
        console.error("Error fetching stock results:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    setShowResults(true);
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleStockSelect = (symbol) => {
    onStockSelect(symbol);
    setShowResults(false);
  };

  return (
    <div className="mt-8">
      <input
        type="text"
        placeholder="Search for a stock..."
        className="border border-gray-300 rounded-md py-2 px-4 block w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading && (
        <div className="mt-2 text-gray-600">
          <FaSpinner className="animate-spin mr-2" /> Loading...
        </div>
      )}
      {!isLoading && showResults && (
        <ul className="mt-2">
          {stockResults.map((stock) => (
            <li
              key={stock["1. symbol"]}
              className="border-t border-gray-300 py-2 px-4 cursor-pointer"
              onClick={() => handleStockSelect(stock["1. symbol"])}
            >
              <strong>{stock["1. symbol"]}</strong> - {stock["2. name"]}
            </li>
          ))}
        </ul>
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
