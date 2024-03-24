import RefreshButton from "./Chunks/Refresh"
import Graph from "./Components/Graph"
import Navbar from "./Components/Navbar"
import Searchbar from "./Components/Searchbar"
import Slider from "./Components/Slider"

function App() {

  return (
<>
  <div>
    <Navbar />
    <Searchbar />
    <RefreshButton />
    <Slider />
    <Graph />
  </div>
</>
  )
}

export default App
