import Lançamentos from "/src/components/lançamentos";
import Populares from "/src/components/populares";
import Terror from "/src/components/Terror";
import Ação from "/src/components/Açao";

function Main() {
  return(
    <div id="movies-container-main">
      <Lançamentos/>
      <Ação/>
      <Terror/>
      <Populares/>
    </div>
  )
}

export default Main;