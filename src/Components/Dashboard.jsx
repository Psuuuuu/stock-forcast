import React from 'react'
import Navbar from './Navbar'
import Searchbar from './Searchbar'

function Dashboard() {
  return (
    <div>
        <Navbar />
        <Searchbar />
        <div>Graph</div>
    </div>
  )
}

export default Dashboard