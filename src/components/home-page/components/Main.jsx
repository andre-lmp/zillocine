import FetchMovies from "../../app/shared-components/MovieFetcher";
import MovieSlides from "../../app/shared-components/MoviesSlides";
import Loading from '../../app/shared-components/LoadingContent';
import { useState } from "react";
import '../../app/shared-styles/App.css';

function Main() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleComponentIsLoading = (e) => {
    setIsLoading(e);
  };

  const componentIsVisible = (e) => {
    setIsVisible(e);
  };

  return(
    <section className="home-container">
      <MovieSlides isVisible={componentIsVisible} contentType={'Filme'} currentPage={'HomePage'}/>

      <div className="home-container">

          {isLoading ? (
            <div className="loading-container">
              <Loading title={true}/>
              <FetchMovies visible={false} isLoading={handleComponentIsLoading} page='1' title='Em Destaque: Os Filmes Mais Recentes' btn='true' type='Movie' genre='Lançamentos'/>
            </div>
          ):(
            <div className="loading-container">
              <FetchMovies visible={isVisible} page='1' title='Em Destaque: Os Filmes Mais Recentes' btn='true' type='Movie' genre='Lançamentos'/>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <Loading title={true}/>
              <FetchMovies visible={false} isLoading={handleComponentIsLoading} page='1' title='Adrenalina em cartaz' btn='true' type='Movie' genre='Ação'/>
            </div>
          ):(
            <div className="loading-container">
              <FetchMovies visible={isVisible} page='1' title='Adrenalina em cartaz' btn='true' type='Movie' genre='Ação'/>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <Loading title={true}/>
              <FetchMovies visible={false} isLoading={handleComponentIsLoading} page='1' title='Horror em exibição' btn='true' type='Movie' genre='Terror'/>
            </div>
          ):(
            <div className="loading-container">
              <FetchMovies visible={isVisible} page='1' title='Horror em exibição' btn='true' type='Movie' genre='Terror'/>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <Loading title={true}/>
              <FetchMovies visible={false} isLoading={handleComponentIsLoading} page='1' title='Diversão para Crianças' btn='true' type='Movie' genre='Animação'/>
            </div>
          ):(
            <div className="loading-container">
              <FetchMovies visible={isVisible} page='1' title='Diversão para Crianças' btn='true' type='Movie' genre='Animação'/>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <Loading title={true}/>
              <FetchMovies visible={false} isLoading={handleComponentIsLoading} page='1' title='Universos paralelos: Ficção' btn='true' type='Movie' genre='Ficção Cientifica'/>
            </div>
          ):(
            <div className="loading-container">
              <FetchMovies visible={isVisible} page='1' title='Universos paralelos: Ficção' btn='true' type='Movie' genre='Ficção Cientifica'/>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <Loading title={true}/>
              <FetchMovies visible={false} isLoading={handleComponentIsLoading} page='1' title='Guerra: Uma Batalha pela Sobrevivência' btn='true' type='Movie' genre='Guerra'/>
            </div>
          ):(
            <div className="loading-container">
              <FetchMovies visible={isVisible} page='1' title='Guerra: Uma Batalha pela Sobrevivência' btn='true' type='Movie' genre='Guerra'/>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <Loading title={true}/>
              <FetchMovies visible={false} isLoading={handleComponentIsLoading} page='1' title='Diversão com a família' btn='true' type='Movie' genre='Comedia'/>
            </div>
          ):(
            <div className="loading-container">
              <FetchMovies visible={isVisible} page='1' title='Diversão com a família' btn='true' type='Movie' genre='Comedia'/>
            </div>
          )}


          {isLoading ? (
            <div className="loading-container">
              <Loading title={true}/>
              <FetchMovies visible={false} isLoading={handleComponentIsLoading} page='1' title='Documentando o mundo' btn='true' type='Movie' genre='Documentario'/>
            </div>
          ):(
            <div className="loading-container">
              <FetchMovies visible={isVisible} page='1' title='Documentando o mundo' btn='true' type='Movie' genre='Documentario'/>
            </div>
          )}

      </div>
    </section>
  )
}

export default Main;