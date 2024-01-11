import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import Home from "./pages/Home";
import Page from "./pages/page";
import Movies from './pages/Filmes';
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
        <Route path='/Page/:id' Component={Page}/>
        <Route path='/Filmes' Component={Movies}/>
      </Routes>
    </Router>
  )
}
