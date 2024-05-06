import FetchMovies from "/src/components/MovieFetcher.jsx";
import MovieSlides from "/src/components/MoviesSlides.jsx";

function Main() {

  return(
    <section className="home-container">
      <MovieSlides/>
      <div className="home-container">
        <FetchMovies page='1' titulo='Em Destaque: Os Filmes Mais Recentes' btn='true' tipo='filme' genre='Lançamentos'/>
        <FetchMovies page='1' titulo='Horror em exibição' btn='true' tipo='filme' genre='Terror'/>
        <FetchMovies page='1' titulo='Adrenalina em cartaz' btn='true' tipo='filme' genre='Ação'/>
        <FetchMovies page='1' titulo='Universos paralelos: Ficção' btn='true' tipo='filme' genre='Ficção Cientifica'/>
        <FetchMovies page='1' titulo='Documentando o mundo' btn='true' tipo='filme' genre='Documentario'/>
      </div>
    </section>
  )
}

export default Main;