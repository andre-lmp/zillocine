import Lançamentos from "/src/components/lançamentos";
import Populares from "/src/components/populares";
import Terror from "/src/components/Terror";
import Ação from "/src/components/Açao";

function Main() {
  return(
    <div id="movies-container-main">
      <Lançamentos page='1' titulo='true' btn='true'/>
      <Ação page='1' titulo='true' btn='true'/>
      <Terror page='1' titulo='true' btn='true'/>
      <Populares page='1' titulo='true' btn='true'/>
    </div>
  )
}

export default Main;