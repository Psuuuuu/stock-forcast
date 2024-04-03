import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

function Searchbar({ onStockSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=8GD048J4PDGFHHZB`
      );
      const data = await response.json();
      setStockResults(data.bestMatches || []);
    } catch (error) {
      console.error("Error fetching stock results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <input
        type="text"
        placeholder="Search for a stock..."
        className="border border-gray-300 rounded-md py-2 px-4 block w-full"
        value={searchTerm}
        onChange={handleChange}
      />
      {isLoading && (
        <div className="mt-2 text-gray-600">
          <FaSpinner className="animate-spin mr-2" /> Loading...
        </div>
      )}
      {!isLoading && (
        <ul className="mt-2">
          {stockResults.map((stock) => (
            <li
              key={stock["1. symbol"]}
              className="border-t border-gray-300 py-2 px-4 cursor-pointer"
              onClick={() => onStockSelect(stock["1. symbol"])}
            >
              <strong>{stock["1. symbol"]}</strong> - {stock["2. name"]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Searchbar;
