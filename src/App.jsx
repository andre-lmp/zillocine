import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useState } from 'react';
import HomePage from "./pages/HomePage";
import PlayerPage from './pages/PlayerPage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import ProfilePage from './pages/ProfilePage';
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import Menu from '/src/components/MenuContainer';
import SearchPage from '/src/pages/SearchPage';
import ScrollTop from '/src/components/ScrollTop';
import AuthPage from '/src/pages/AuthPage';
import '/src/styles/App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Router>
      <ScrollTop/>
      <Routes>
        <Route path='/Auth' Component={AuthPage}/>
        <Route path='*' element={isLoggedIn ? <AuthenticatedRoutes/> : <Navigate to='/Auth'/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
};

function AuthenticatedRoutes(){
  const [menuIsActive, setMenuIsActive] = useState(false);

  const isMenuActive = (e) => {
    setMenuIsActive(e);
  };
  
  return(
    <>
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
    </>
  );
};
