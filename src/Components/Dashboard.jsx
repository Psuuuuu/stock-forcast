import React, { useState } from 'react';
// import React from 'react'
import Navbar from './Navbar'
// import Searchbar from './Searchbar'

// function Dashboard() {
//   return (
//     <div>
//         <Navbar />
//         <Searchbar />
//         <div>Graph</div>
//     </div>
//   )
// }

// export default Dashboard




import Searchbar from './Searchbar'; // Adjust the path as needed
import StockChart from './StockChart'; // Adjust the path as needed

function Dashboard() {
  const [selectedStock, setSelectedStock] = useState('');

  return (
    <div>
      <Navbar />
      <Searchbar onStockSelect={setSelectedStock} />
      {selectedStock && <StockChart stockSymbol={selectedStock} />}
    </div>
  );
}

export default Dashboard;
