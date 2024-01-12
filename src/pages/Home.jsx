import Header from "/src/components/header";
import Main from "/src/components/Main";
import Footer from "/src/components/footer";
import Test from '/src/components/teste';
import "../App.css";

function Home() {
  return (
    <main className="app-main">
      <Header/>
      <Main/>
      <Footer/>
      <Test/>
    </main>
  )
}

export default Home;