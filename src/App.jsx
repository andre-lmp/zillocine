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
import SearchPage from '/src/pages/SearchPage';
import '/src/styles/App.css';

export default function App() {
  const [menuIsActive, setMenuIsActive] = useState(false);

  const isMenuActive = (e) => {
    setMenuIsActive(e);
  };

  return (
    <Router>
      <Header menuIsActive={isMenuActive}/>
      <Menu isActive={menuIsActive} isDisable={isMenuActive}/>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/Page/:id/:type' Component={PlayerPage}/>
        <Route path='/Movies' Component={MoviesPage}/>
        <Route path='/Series' Component={SeriesPage}/>
        <Route path='/Profile' Component={ProfilePage}/>
        <Route path='/Search' Component={SearchPage}/>
      </Routes>
      <Footer/>
    </Router>
  )
}
