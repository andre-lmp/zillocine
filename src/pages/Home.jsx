import Header from "/src/components/header";
import Main from "/src/components/Main";
import Footer from "/src/components/footer";
import "../App.css";
import { useState, useRef } from "react";

function Home() {
  const AppHeight = useRef();
  const [height, setHeight] = useState();
  const GetHeight = () => {
    setHeight(AppHeight.current?.offsetHeight);
  }

  setTimeout(GetHeight, 2000);

  return (
    <main ref={AppHeight} className="container-home">
      <Header HeightScroll={height}/>
      <Main/>
      <Footer/>
    </main>
  )
}

export default Home;