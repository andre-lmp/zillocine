import { useRef } from "react";
import { LuSearch } from "react-icons/lu";
import { HiXMark } from "react-icons/hi2";

function Search({hide, onValueChange}) {

    const SearchBar = useRef();
    if (SearchBar.current) {
        if (hide === false) {
            SearchBar.current.style.transform = 'translateY(0%)';
        }else{
            SearchBar.current.style.transform = 'translateY(-100%)';
        }
    }

    return(
        <div ref={SearchBar} className="search-bar-container">
            <div className="Search-input-container">
                <LuSearch id="search-icon-bar" className="lupa-icon"/>
                <input type="text" className="inputSearch" placeholder="O que voce está procurando ?"></input>
                <HiXMark onClick={() => onValueChange(true)} className="xmark-icon-input"/>
            </div>
        </div>
    )
}

export default Search;