// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

export default function useTmdbFetch() {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const newDate = new Date().toISOString().split('T')[0];

    // busca series populares entre os usuarios do TMDB
    const fetchPopularSeries = async () => {
        try{
            const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&include_adult=false&language=pt-BR&include_image_language=pt&page=1&sort_by=vote_average.desc&vote_count.gte=200`);
            if ( response.ok ){
                const fetchData = await response.json();
                return fetchData.results;
            }

        } catch (error){
            console.error(error);
        }
    };

    // busca series lançamentos com base na data fornecida
    const fetchReleasedSeries = async ( page: number = 1 ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&include_adult=false&language=pt-BRS&sort_by=popularity.desc&air_date.lte={max_date}&air_date.gte=${newDate}&include_image_language=pt&page=${page}`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results;
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    // Busca series com base no genero fornecido
    const fetchSeries = async ( genre: string, page: number = 1 ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&language=pt-BR&with_genres=${genre}&page=${page}&include_image_language=pt`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results;
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    // busca as temporadas de uma serie com base no id da serie e numero da temporada
    const fetchSerieSeasons = async ( serieId: string, seasonNumber: string ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonNumber}?api_key=${token}&language=pt-BR&include_image_language=pt`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData;
            }
        } catch ( error ) {
            console.error( error );
            return false;
        }
    };

    // busca series com base em palavras chaves
    const fetchSerieByTerm = async ( term: string ) => {
        try{
            const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${token}&language=pt-BR&include_image_language=pt&query=${term}`);
            if (response.ok) {
                const fetchData = await response.json();
                return fetchData.results;
            };
       } catch (error) {
            console.error(error);
       }
    };

    // faz uma busca mais detalhada de uma serie com o id fornecido
    const fetchSingleSerie = async ( serieId: string ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${token}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos,credits`);
            if (response.ok) {
            const fetchData = await response.json();
            return fetchData;
            }

        } catch (error) {
            console.log(error);
        }
    };

    // busca filmes lançamentos com base na data fornecida
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

    // busca filmes populares entre os usuarios do TMDB
    const fetchPopularMovies = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?&api_key=${token}&include_adult&include_video&language=pt-BR&page=1&sort_by=popularity.desc&include_image_language=pt`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results
            };
        } catch (error) {
            console.error( error );
        }
    };

    // Busca filmes com base no genero fornecido
    const fetchMovies = async ( genre: string, page: number = 1 ): Promise<tmdbObjProps[] | undefined> => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${token}&with_genres=${genre}&language=pt-BR&include_image_language=pt&page=${page}`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results
            };

        } catch (error) {
            console.error(error);
            return;
        }
    };

    // Faz uma requisição para cada genero em uma lista de generos
    const fetchAllGenres = async ( genreList: string[], contentType: string ) => {
        return new Promise(( resolve, reject ) => {
            try {
                Promise.all(genreList.map( async ( genre ) => {
                    const response = contentType === 'movie' ? await fetchMovies( genre ) : await fetchSeries( genre );
                    return response;
                } )).then( results => {
                    resolve( results );
                })
            } catch ( error ) {
                reject( error );
            }
        }); 
    };

    // Busca multiplos filmes a partir de uma lista de ids
    const fetchMultipleMovies = async ( idsList: string[] ): Promise<tmdbObjProps[]> => {
        return new Promise(( resolve, reject ) => {
            try {
                Promise.all(idsList.map(async ( id ) => {
                    const response = await fetchSingleMovie( id );
                    return response;
                })).then( result => {
                    resolve( result );
                });
            } catch (error) {
                console.error( error );  
                reject( error ); 
            }
        });
    };

    // Busca multiplas series a partir de uma lista de ids
    const fetchMultipleSeries = async ( idsList: string[] ): Promise<tmdbObjProps[]> => {
        return new Promise(( resolve, reject ) => {
            try {
                Promise.all(idsList.map(async ( id ) => {
                    const response = await fetchSingleSerie( id );
                    return response;
                })).then( result => {
                    resolve( result );
                });
            } catch (error) {
                console.error( error );  
                reject( error ); 
            }
        });
    };

    // Busca uma lista de ids selecionados
    const fetchSelectedIds = async ( idsList: string[], contentType: string ) => {
        const result: tmdbObjProps[] = await new Promise(( resolve, reject ) => {
            try {
                Promise.all(idsList.map( async ( id ) => {
                    const response = contentType === 'movie' ? await fetchSingleMovie( id ) : await fetchSingleSerie( id );
                    return response;
                })).then( response => {
                    resolve( response );
                })
            } catch (error) {
                reject( error );
            }
        })

        return result;
    };

    // faz uma busca mais detalhada de um filme com o id fornecido
    const fetchSingleMovie = async ( movieId: string ) => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${token}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos,credits`);
          if ( response.ok ){
            const fetchData = await response.json();
            return fetchData;
          }
    
        } catch (error) {
          console.log(error);
        }
    };

    // busca filmes com base em palavras chaves
    const fetchMovieByTerm = async ( term: string ) => {
        try{
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${token}&language=pt-BR&query=${term}&include_image_language=pt`);
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results;
            };
       } catch (error) {
            console.error(error);
       }
    };

    // busca filmes similares ao escolhido pelo usuario
    const fetchSimilarMovies = async ( movieId: string ) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${token}&language=pt-BR&page=1&include_image_language=pt`);  
            if ( response.ok ) {
                const fetchData = await response.json();
                return fetchData.results
            };

        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return { 
        fetchSeries, 
        fetchMovies, 
        fetchReleasedMovies, 
        fetchAllGenres, 
        fetchPopularSeries, 
        fetchSingleMovie, 
        fetchSingleSerie, 
        fetchSerieByTerm,
        fetchMovieByTerm,
        fetchSimilarMovies,
        fetchSerieSeasons,
        fetchPopularMovies,
        fetchReleasedSeries,
        fetchSelectedIds,
        fetchMultipleMovies,
        fetchMultipleSeries
    };
};