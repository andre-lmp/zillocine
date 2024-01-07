import Lançamentos from "/src/components/lançamentos";
import Populares from "/src/components/populares";
import Sucessos from "/src/components/Sucessos";

function Main() {
  return(
    <div className="movies-container-main">
      <Lançamentos/>
      <Populares/>
      <Sucessos/>
    </div>
  )
}

export default Main;