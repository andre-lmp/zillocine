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