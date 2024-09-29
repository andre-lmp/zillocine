
export default function useTmdbFetch() {
    const token = '00f20ee77fc33a18892241c0f8c7d763';
    const newDate = new Date().toISOString().split('T')[0];

    const fetchReleasedSeries = async ( page: number = 1 ) => {
        try{
            const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${token}&language=pt-BR&page=${page}`);
            if ( response.ok ){
                const fetchData = await response.json();
                return fetchData.results;
            }

        } catch (error){
            console.error(error);
        }
    };

    const fetchSeries = async ( genre: string, page: number = 1 ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&language=pt-BR&with_genres=${genre}&page=${page}`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results;
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    const fetchReleasedMovies = async ( page: number = 1 ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${token}&primary_release_date.gte=${newDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt&page=${page}`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const fetchMovies = async ( genre: string, page: number = 1 ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${token}&with_genres=${genre}&language=pt-BR&include_image_language=pt&page=${page}`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results
            };

        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const fetchAllGenres = async ( genreList: string[], contentType: string ) => {
        return new Promise(( resolve, reject ) => {
            try {
                Promise.all( genreList.map( async ( genre ) => {
                    const response = contentType === 'movie' ? await fetchMovies( genre ) : await fetchSeries( genre );
                    return response;
                } )).then( results => {
                    resolve( results );
                })
            } catch ( error ) {
                console.error( error );
                reject( error );
            }
        }); 
    };

    const fetchSingleMovie = async ( movieId: string ) => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${token}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos`);
          if ( response.ok ){
            const fetchData = await response.json();
            return fetchData;
          }
    
        } catch (error) {
          console.log(error);
        }
    };
    
    const fetchSingleSerie = async ( serieId: string ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${token}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos`);
            if (response.ok) {
            const fetchData = await response.json();
            return fetchData;
            }

        } catch (error) {
            console.log(error);
        }
    };

    const fetchMovieByTerm = async ( term: string ) => {
        try{
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${token}&language=pt-BR&query=${term}`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results;
            };
       } catch (error) {
            console.error(error);
       }
    };

    const fetchSerieByTerm = async ( term: string ) => {
        try{
            const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${token}&language=pt-BR&query=${term}`);
            if (response.ok) {
                const fetchData = await response.json();
                return fetchData.results;
            };
       } catch (error) {
            console.error(error);
       }
    };

    const fetchSimilarMovies = async ( movieId: string ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${token}&language=pt-BR&page=1`);  
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results
            };

        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const fetchSerieSeasons = async ( serieId: string, seasonNumber: string ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonNumber}?api_key=${token}&language=pt-BR`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData;
            }
        } catch ( error ) {
            console.error( error );
            return false;
        }
    };

    return { 
        fetchSeries, 
        fetchMovies, 
        fetchReleasedMovies, 
        fetchAllGenres, 
        fetchReleasedSeries, 
        fetchSingleMovie, 
        fetchSingleSerie, 
        fetchSerieByTerm,
        fetchMovieByTerm,
        fetchSimilarMovies,
        fetchSerieSeasons
    };
};