
import { fetchAllTrending } from "./allTrending";
import { fetchMovieById } from "./movieById";
import { fetchMoviesByIdList } from "./moviesByIdList";
import { fetchMovieByTerm } from "./movieByTerm";
import { fetchPopularMovies } from "./popularMovies";
import { fetchPopularSeries } from "./popularSeries";
import { fetchReleasedMovies } from "./releasedMovies";
import { fetchReleasedSeries } from "./releasedSeries";
import { fetchSeriesByGenre } from "./seriesByGenre";
import { fetchSeriebyId } from "./serieById";
import { fetchSeasons } from "./seasons";
import { fetchSeriesByIdList } from "./seriesByIdList";
import { fetchSerieByTerm } from "./seriesByTerm";
import { fetchMoviesByGenre } from "./moviesByGenre";
import { fetchSimilarMovies } from "./similarMovies";

export default function useTmdbFetch() {
    return { 
        fetchSeriesByGenre, 
        fetchMoviesByGenre, 
        fetchReleasedMovies, 
        fetchPopularSeries, 
        fetchMovieById, 
        fetchSeriebyId, 
        fetchSerieByTerm,
        fetchMovieByTerm,
        fetchSimilarMovies,
        fetchSeasons,
        fetchPopularMovies,
        fetchReleasedSeries,
        fetchMoviesByIdList,
        fetchSeriesByIdList,
        fetchAllTrending
    };
};