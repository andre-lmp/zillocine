import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import Home from "./pages/Home";
import PlayerPage from './pages/PlayerPage';
import Movies from './pages/Movies';
import Series from './pages/Series';
import ProfilePage from './pages/Profile';
import './App.css';


export default function App() {
  const [idmovie, setIdmovie] = useState();
  const click = (valor) => {
    setIdmovie(valor);
  }
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/Page/:id/:type' Component={PlayerPage}/>
        <Route path='/Filmes' Component={Movies}/>
        <Route path='/Series' Component={Series}/>
        <Route path='/Perfil' Component={ProfilePage}/>
      </Routes>
    </Router>
  )
}
