import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useState} from 'react';
import HomePage from "../home-page/page/Home.jsx";
import PlayerPage from '../player-page/page/PlayerPage.jsx';
import MoviesPage from '../movies-series-page/movie-page/Movies.jsx'
import SeriesPage from '../movies-series-page/series-page/Series.jsx';
import ProfilePage from '../profile-page/page/Profile.jsx';
import Header from '../home-page/components/Header.jsx';
import Footer from '../home-page/components/Footer.jsx';
import Menu from '../app/shared-components/mobile-menu/Menu.jsx';
import SearchPage from '../search-page/page/Search.jsx';
import ScrollTop from '../app/shared-components/scroll-to-top/Scroll.jsx';
import AuthPage from '../auth-page/page/Auth.jsx';
import UserAlert from '../auth-page/auth-alert/Alert.jsx';
import './shared-styles/App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAlertOnScreen, setIsAlertOnScreen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(undefined);
  const [userData, setUserData] = useState(undefined);

  return (
    <>
      <Router>
        <ScrollTop/>
        <UserAlert isActive={isAlertOnScreen} onValueChange={setIsAlertOnScreen} message={alertMessage}/>
        <Routes>
          <Route path='/Auth' element={<AuthPage alertMessage={setAlertMessage} isAlertActive={setIsAlertOnScreen} onUserData={setUserData}/>}/>
          <Route path='*' element={isLoggedIn ? <AuthenticatedRoutes userData={userData}/> : <Navigate to='/Auth'/>}/>
        </Routes>
        <Footer/>
      </Router>
    </>
  );
};

function AuthenticatedRoutes(userData){
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
        <Route path='/Player/:type/:id' Component={PlayerPage}/>
        <Route path='/Movies' Component={MoviesPage}/>
        <Route path='/Series' Component={SeriesPage}/>
        <Route path='/Profile' element={<ProfilePage userData={userData}/>}/>
        <Route path='/Search' Component={SearchPage}/>
      </Routes>
    </>
  );
};
