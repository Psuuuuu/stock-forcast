import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function StockChart({ stockSymbol }) {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      const apiKey = "UGL2A2KIJPXJE303"; // Remember to replace with your actual Alpha Vantage API key
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const timeSeries = data["Time Series (Daily)"];
        const formattedData = Object.entries(timeSeries)
          .map(([date, value]) => ({
            date,
            close: parseFloat(value["4. close"]),
          }))
          .slice(0, 180); // Take the latest 30 days
        setStockData(formattedData.reverse()); // Reverse to get the most recent dates on the right
      } catch (error) {
        console.error("Error fetching stock time series data:", error);
      }
    };

    if (stockSymbol) {
      fetchStockData();
    }
  }, [stockSymbol]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={stockData}
        margin={{
          top: 10,
          right: 50, // Increased right margin for forecast space
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorClose)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default StockChart;
