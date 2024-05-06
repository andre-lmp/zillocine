import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import HomePage from "./pages/HomePage";
import PlayerPage from './pages/PlayerPage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import ProfilePage from './pages/ProfilePage';
import Header from "/src/components/header";
import '/src/styles/App.css';

export default function App() {
  
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/Page/:id/:type' Component={PlayerPage}/>
        <Route path='/Movies' Component={MoviesPage}/>
        <Route path='/Series' Component={SeriesPage}/>
        <Route path='/Profile' Component={ProfilePage}/>
      </Routes>
    </Router>
  )
}
