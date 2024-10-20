'use client'

import React, { createContext, ReactNode } from "react";

// Informações de Generos de filmes no TMDB como, numero do genero, titulo para o genero e nome do genero
const tmdbMovieGenres = {
    release: [ 'release', 'Em Destaque: Os Filmes Mais Recentes', 'Lançamentos' ], 
    horror: [ '27', 'Horror em exibição', 'Terror' ],
    action: [ '28', 'Adrenalina em cartaz', 'Ação' ],
    comedy: [ '35', 'Comedia: Diversão com a família', 'comédia' ],
    cartoon: [ '16', 'Diversão para Crianças', 'Desenho' ],
    romance: [ '10749', 'Histórias de Amor à Moda Antiga', 'Romance' ],
    documentary: [ '99', 'Documentando o mundo', 'Documentário' ],
    war: [ '10752', 'Guerra: Uma Batalha pela Sobrevivência', 'Guerra' ],
    fiction: [ '878', 'Universos paralelos: Ficção', 'Ficção' ],
    adventure: [ '12', 'Desbravando o Desconhecido: Aventuras', 'Aventura' ],
};

// Informações de Generos de series no TMDB como, numero do genero, titulo para o genero e nome do genero
const tmdbSerieGenres = {
    release: [ 'release', 'Em Destaque: As series Mais Recentes', 'Lançamentos' ],
    suspense: [ '9648', 'Tensão em alta: suspense', 'Suspense' ],
    action: [ '10759', 'Adrenalina em cartaz', 'Ação' ],
    comedy: [ '35', 'Comedia: Diversão com a família', 'Comédia' ],
    war: [ '10768', 'Guerra: Uma Batalha pela Sobrevivência', 'Guerra' ],
    cartoon: [ '16', 'Diversão para Crianças', 'Desenho' ],
    documentary: [ '99', 'Documentando o mundo', 'Documentário' ],
};

export type tmdbObjProps = Record<string, any>;

type tmdbContextProps = {
    movieGenres: tmdbObjProps;
    serieGenres: tmdbObjProps;
};

export const TmdbContext = createContext<tmdbContextProps>({
    movieGenres: tmdbMovieGenres,
    serieGenres: tmdbSerieGenres
});

export const TmdbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <TmdbContext.Provider value={{ movieGenres: tmdbMovieGenres, serieGenres: tmdbSerieGenres }}>
            { children }
        </TmdbContext.Provider>
    )
}