import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Page from "./pages/page";
import './App.css';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/Page' Component={Page}/>
      </Routes>
    </Router>
  )
}
