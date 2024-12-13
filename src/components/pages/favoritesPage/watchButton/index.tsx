import { useRouter } from "next/navigation";

// Icons com React-icons
import { FaPlay } from "react-icons/fa";

import { tmdbObjProps } from "@/components/contexts/tmdbContext";

type WatchButtonProps = {
    content: tmdbObjProps;
};

export default function WatchButton( props: WatchButtonProps ) {
    const router = useRouter();

    const nextNavigate = ( content: tmdbObjProps ) => {
        const contentObjKeys = Object.keys( content );

        if (contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/serie/${content.id}`, { scroll: true });
        };

        if (!contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/movie/${content.id}`, { scroll: true });
        };
    };

    return (
        <button onClick={() => {nextNavigate( props.content )}} className="px-20 btn bg-white/10 hover:bg-white/10 text-[17px] font-noto_sans font-normal text-white border-none outline-none rounded-md cursor-pointer">
            <FaPlay className="text-[15px]"/>
            Assitir
        </button>
    );
};