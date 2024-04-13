// import './App.css';
import CityTable from './components/CityTable';
import { BrowserRouter , Route ,Routes } from 'react-router-dom';
import WeatherPage from './components/WeatherPage';
import FavoriteLocationsPage from './components/FavoriteLocationsPage';

function App() {
  return (
    <div className="App">
      {/* <h1 className="text-3xl font-bold mb-4">City Data</h1> */}
      <BrowserRouter>
      <Routes>
        <Route path='/'  Component={CityTable}/>
        <Route path='/weather/:city'  Component={WeatherPage}/>
        <Route path='/favorite'  Component={FavoriteLocationsPage}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

