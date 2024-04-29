import FetchMovies from "/src/components/ContainerMovies";

function Main() {

  return(
    <div className="home-movies-container">
      <FetchMovies page='1' titulo='Em Destaque: Os Filmes Mais Recentes' btn='true' tipo='filme' genre='Lançamentos'/>
      <FetchMovies page='1' titulo='Horror em exibição' btn='true' tipo='filme' genre='Terror'/>
      <FetchMovies page='1' titulo='Adrenalina em cartaz' btn='true' tipo='filme' genre='Ação'/>
      <FetchMovies page='1' titulo='Universos paralelos: Ficção' btn='true' tipo='filme' genre='Ficção Cientifica'/>
      <FetchMovies page='1' titulo='Documentando o mundo' btn='true' tipo='filme' genre='Documentario'/>
    </div>
  )
}

export default Main;