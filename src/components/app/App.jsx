import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from "/src/components/home-page/HomePage";
import PlayerPage from '/src/components/player-page/PlayerPage';
import MoviesPage from '/src/components/movies-series-page/MoviesPage';
import SeriesPage from '/src/components/movies-series-page/SeriesPage';
import ProfilePage from '/src/components/profile-page/ProfilePage';
import Header from "/src/components/home-page/components/Header";
import Footer from "/src/components/home-page/components/Footer";
import Menu from '/src/components/app/shared-components/MenuContainer';
import SearchPage from '/src/components/search-page/SearchPage';
import ScrollTop from '/src/components/app/shared-components/ScrollTop';
import AuthPage from '/src/components/auth-page/AuthPage';
import UserAlert from './shared-components/UserAlert';
import './shared-styles/App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAlertOnScreen, setIsAlertOnScreen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(undefined);

  useEffect(() => {
    console.log(isAlertOnScreen);
  },[isAlertOnScreen]);
  return (
    <>
      <Router>
        <ScrollTop/>
        <UserAlert isActive={isAlertOnScreen} onValueChange={setIsAlertOnScreen} message={alertMessage}/>
        <Routes>
          <Route path='/Auth' element={<AuthPage alertMessage={setAlertMessage} isAlertActive={setIsAlertOnScreen}/>}/>
          <Route path='*' element={isLoggedIn ? <AuthenticatedRoutes/> : <Navigate to='/Auth'/>}/>
        </Routes>
        <Footer/>
      </Router>
    </>
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
