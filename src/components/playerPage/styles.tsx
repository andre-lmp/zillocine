import styled from "styled-components";

export const PlayerWrapper = styled.section`
    min-height: 100vh;
`;

export const HeaderWrapper = styled.header`
    width: 100%;
    overflow-x: hidden;

    & .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 15;
        background-image: linear-gradient( to top, #020515, #020515, rgba(2, 5, 21, 0.3), transparent)
    }
`;