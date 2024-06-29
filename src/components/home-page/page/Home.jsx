import "../home-css/Home.css";
import Main from "../components/Main";
import { useState, useEffect } from 'react';
import HeaderSlides from "../../app/shared-components/content-sliders/HeaderSlides.jsx";

function Home() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <main className="home-container">
      <HeaderSlides isVisible={(value) => {setIsVisible(value)}}  currentPage={'Home'}/>
      {isVisible && <Main/>}
    </main>
  )
}

export default Home;