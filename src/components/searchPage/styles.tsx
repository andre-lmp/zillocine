import styled from "styled-components";

export const SearchResultWrapper = styled.div`
    width: 100%;

    & .result-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat( auto-fill, minmax(130px, 1fr) );
        gap: 16px;
    }
`;