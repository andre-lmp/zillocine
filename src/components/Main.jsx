import FetchMovies from "/src/components/MovieFetcher.jsx";
import MovieSlides from "/src/components/MoviesSlides.jsx";
import Loading from '/src/components/LoadingContent.jsx';
import { useState } from "react";

function Main() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingIsDisable, setLoadingIsDisable] = useState(true);

  const handleLoadingDisable = (e) => {
    if (e) {
        setLoadingIsDisable(e);
    };
  };

  const handleComponentLoaded = (e) => {
    if (e){
      setIsLoading(false);
    }else{
      setIsLoading(true);
    }
  };

  return(
    <section className="home-container">
      <MovieSlides/>

      <div className="home-container">

        <div className="loading-container">
          <Loading disable={handleLoadingDisable} title={true} active={isLoading}/>
          <FetchMovies page='1' isLoaded={handleComponentLoaded} title='Em Destaque: Os Filmes Mais Recentes' btn='true' type='Movie' genre='Lançamentos'/>
        </div>

        <div className="loading-container">
          <Loading disable={handleLoadingDisable} title={true} active={isLoading}/>
          <FetchMovies page='1' isLoaded={handleComponentLoaded} title='Horror em exibição' btn='true' type='Movie' genre='Terror'/>
        </div>

        <div className="loading-container">
          <Loading disable={handleLoadingDisable} title={true} active={isLoading}/>
          <FetchMovies page='1' isLoaded={handleComponentLoaded} title='Adrenalina em cartaz' btn='true' type='Movie' genre='Ação'/>
        </div>

        <div className="loading-container">
          <Loading disable={handleLoadingDisable} title={true} active={isLoading}/>
          <FetchMovies page='1' isLoaded={handleComponentLoaded} title='Universos paralelos: Ficção' btn='true' type='Movie' genre='Ficção Cientifica'/>
        </div>

        <div className="loading-container">
          <Loading disable={handleLoadingDisable} title={true} active={isLoading}/>
          <FetchMovies page='1' isLoaded={handleComponentLoaded} title='Documentando o mundo' btn='true' type='Movie' genre='Documentario'/>
        </div>

      </div>
    </section>
  )
}

export default Main;