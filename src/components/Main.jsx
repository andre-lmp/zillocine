import PopularMovies from "/src/components/PopularMovies";
import LatestMovies from "/src/components/LatestMovies";
import HorrorMovies from "/src/components/HorrorMovies";
import ActionMovies from "/src/components/ActionMovies";
import ComedyMovies from "/src/components/ComedyMovies";
import Documentaries from "/src/components/Documentaries";

function Main() {

  return(
    <div id="movies-container-main">
      <LatestMovies page='1' titulo='true' btn='true' tipo='filme'/>
      <ActionMovies page='1' titulo='true' btn='true' tipo='filme'/>
      <HorrorMovies page='1' titulo='true' btn='true' tipo='filme'/>
      <PopularMovies page='1' titulo='true' btn='true' tipo='filme'/>
      <ComedyMovies page='1' titulo='true' btn='true' tipo='filme'/>
      <Documentaries page='1' titulo='true' btn='true' tipo='filme'/>
    </div>
  )
}

export default Main;