import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import HomePage from "./pages/HomePage";
import PlayerPage from './pages/PlayerPage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import ProfilePage from './pages/ProfilePage';
import Header from "/src/components/header";
import Footer from "/src/components/footer";
import Menu from '/src/components/MenuContainer';
import SearchBar from '/src/components/SearchBar';
import '/src/styles/App.css';

export default function App() {
  const [menuIsActive, setMenuIsActive] = useState(false);
  const [searchBarActive, setSearchBarActive] = useState(false);

  const isMenuActive = (e) => {
    setMenuIsActive(e);
  };

  const isSearchBarActive = (e) => {
    setSearchBarActive(e);
  };

  return (
    <Router>
      <Header menuIsActive={isMenuActive} searchBarActive={isSearchBarActive}/>
      <Menu isActive={menuIsActive} isDisable={isMenuActive}/>
      <SearchBar isActive={searchBarActive} isDisable={isSearchBarActive}/>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/Page/:id/:type' Component={PlayerPage}/>
        <Route path='/Movies' Component={MoviesPage}/>
        <Route path='/Series' Component={SeriesPage}/>
        <Route path='/Profile' Component={ProfilePage}/>
      </Routes>
      <Footer/>
    </Router>
  )
}
