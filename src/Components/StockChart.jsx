import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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
          .slice(0, 30); // Take the latest 30 days
        setStockData(formattedData);
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
      <LineChart
        data={stockData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default StockChart;
