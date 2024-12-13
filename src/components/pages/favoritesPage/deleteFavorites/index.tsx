
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Icons com React-icons
import { AiFillDelete } from "react-icons/ai";

// Fornece funções para interação com serviços do firebase
import useFirebase from "@/components/hooks/firebaseHook";

type DeleteFavoriteProps = {
    content: tmdbObjProps;
};

export default function DeleteFavorite( props: DeleteFavoriteProps ) {
    const { deleteUserFavoritesOnDb } = useFirebase();

    const deleteFavorite = ( content: tmdbObjProps ) => {
        const contentObjKeys = Object.keys( content );

        if (contentObjKeys.includes( 'first_air_date' )) {
            deleteUserFavoritesOnDb( content.id, 'serie' );
        };

        if (!contentObjKeys.includes( 'first_air_date' )) {
            deleteUserFavoritesOnDb( content.id, 'movie' );
        };
    };

    return (
        <AiFillDelete 
            className="text-2xl text-orangered/60 md:hover:text-orangered cursor-pointer" 
            onClick={() => {deleteFavorite( props.content )}}
        />
    );
};