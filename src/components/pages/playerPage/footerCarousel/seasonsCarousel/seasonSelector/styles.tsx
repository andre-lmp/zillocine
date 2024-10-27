import styled from "styled-components";

export const ComponentWrapper = styled.div`
    margin-bottom: 20px;

    & .seasons-modal {
        scrollbar-color: orangered #16142b;
        scrollbar-width: thin;
        -mox-scrollbar-width: thin;
        -mox-scrollbar-color: orangered #16142b;
    }
`;

export const SeasonsWrapper = styled.div`
    width: 100%;
    display: grid;
    margin-top: 30px;
    grid-template-columns: repeat( auto-fill, minmax( 200px, 1fr ));
    gap: 20px;
`;