// Obtem a nota do publico sobre o filme/serie
export const getImdbReviews = ( vote_average: number, vote_count: number ) => {
    return (
        <p className='px-4 h-7 bg-darkslateblue whitespace-nowrap text-base font-normal font-noto_sans rounded flex items-center'>
            Imdb: { vote_average.toFixed(0) } 
            <span className='hidden md:inline ml-1'>({ vote_count })</span>
        </p>
    );
};