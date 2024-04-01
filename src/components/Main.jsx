import FetchMovies from "/src/components/ContainerMovies";

function Main() {

  return(
    <div className="home-movies-container">
      <FetchMovies page='1' titulo='Laçamentos' btn='true' tipo='filme' genre='Lançamentos'/>
      <FetchMovies page='1' titulo='Terror' btn='true' tipo='filme' genre='Terror'/>
      <FetchMovies page='1' titulo='Ação' btn='true' tipo='filme' genre='Ação'/>
      <FetchMovies page='1' titulo='Ficção' btn='true' tipo='filme' genre='Ficção Cientifica'/>
      <FetchMovies page='1' titulo='Documentarios' btn='true' tipo='filme' genre='Documentario'/>
    </div>
  )
}

export default Main;