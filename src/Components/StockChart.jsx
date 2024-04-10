import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function StockChart({ stockSymbol }) {
  const [chartType, setChartType] = useState("line"); // Default chart type is line
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        let url;
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const formattedToday = formatDate(today);
        const formattedSixMonthsAgo = formatDate(sixMonthsAgo);

        if (chartType === "line") {
          // Line chart data fetching
          const apiKey = "UGL2A2KIJPXJE303"; // Replace with your Alpha Vantage API key
          url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;
        } else if (chartType === "bar") {
          // Bar chart data fetching
          url = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${formattedSixMonthsAgo}/${formattedToday}?adjusted=true&sort=asc&limit=120&apiKey=kmBwNvupY5MSt6djXfLMtytNXEvxnmkx`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (chartType === "line") {
          const timeSeries = data["Time Series (Daily)"];
          const formattedData = Object.entries(timeSeries)
            .map(([date, value]) => ({
              date,
              close: parseFloat(value["4. close"]),
            }))
            .slice(0, 180); // Take the latest 30 days
          setStockData(formattedData.reverse()); // Reverse to get the most recent dates on the right
        } else if (chartType === "bar") {
          const barsData = data.results.map((bar) => ({
            date: bar.t,
            close: bar.c,
          }));
          setStockData(barsData);
        }
      } catch (error) {
        console.error("Error fetching stock time series data:", error);
      }
    };

    if (stockSymbol) {
      fetchStockData();
    }
  }, [stockSymbol, chartType]);

  const handleLineChartButtonClick = () => {
    setChartType("line");
  };

  const handleBarChartButtonClick = () => {
    setChartType("bar");
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="mt-8">
      <ResponsiveContainer width="100%" height={400}>
        {chartType === "line" ? (
          <AreaChart
            data={stockData}
            margin={{ top: 10, right: 50, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorClose)"
            />
          </AreaChart>
        ) : (
          <BarChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="close" fill="#8884d8" />
          </BarChart>
        )}
      </ResponsiveContainer>
      <div className="mt-4">
        <button
          className={`mr-2 ${
            chartType === "line" ? "bg-blue-500" : "bg-gray-300"
          } hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`}
          onClick={handleLineChartButtonClick}
        >
          Line Chart
        </button>
        <button
          className={`${
            chartType === "bar" ? "bg-blue-500" : "bg-gray-300"
          } hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`}
          onClick={handleBarChartButtonClick}
        >
          Bar Chart
        </button>
      </div>
    </div>
  );
}

export default StockChart;
