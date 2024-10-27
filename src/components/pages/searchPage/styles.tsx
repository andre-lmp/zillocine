import styled from "styled-components";

export const SearchResultWrapper = styled.div`
    width: 100%;

    & .result-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat( auto-fill, minmax(130px, 1fr) );
        gap: 15px;
    }

    @media screen and ( min-width: 640px ) {
        & .result-container {
            grid-template-columns: repeat( auto-fill, minmax(150px, 1fr) );
        }
    }

    @media screen and ( width >= 1024px ) {
        & .result-container {
            grid-template-columns: repeat( auto-fill, minmax(170px, 1fr) );
            gap: 17px;
        }
    }
`;

export const imageBox = styled.div`
    width: 100%;
    overflow-y: hidden;
    border-radius: 6px;
    position: relative;
    background-color: #16142b;

    & .image {
        transition: transform .2s ease-in-out; 
    }

    & .description {
        position: absolute;
        bottom: 6px;
        padding: 0px 6px;
        left: 0;
        opacity: 0;
        transform: translateY(100%);
        transition: transform .2s ease-in-out; 
    }

    @media screen and ( width >= 768px ) {
        &:hover .description {
            opacity: 1;
            transform: translateY(0%);
        } 

        &:hover .image {
            transform: translateY(-22%) scale(0.5);
            border-radius: 6px;
        }
    }

`;