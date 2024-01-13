import Header from "/src/components/header";
import Main from "/src/components/Main";
import Footer from "/src/components/footer";
import "../App.css";

function Home() {
  return (
    <main className="app-main">
      <Header/>
      <Main/>
      <Footer/>
    </main>
  )
}

export default Home;