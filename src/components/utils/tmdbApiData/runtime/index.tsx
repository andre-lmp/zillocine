// Obtem o tempo de duração do filme 
export const getRunTime = ( runtime: number ) => {

    if ( !runtime || runtime === 0 ) {
        return
    };

    if ( runtime < 60 ) {
        return <span className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-400">{ runtime }m</span>
    };

    const hours = ( runtime / 60 ).toFixed(0);
    const minites = runtime % 60;

    return  <span className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-300">{ hours }h { minites }m</span>
};