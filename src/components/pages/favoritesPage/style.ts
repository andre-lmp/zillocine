import styled from "styled-components";

export const FavoritesContainer = styled.section`
    @keyframes FadeIn {
        from { opacity: 0 }
        to { opacity: 100% }
    }

    display: flex;
    flex-direction: column;
    row-gap: 28px;
    align-items: start;
    margin-top: 40px;
    animation: FadeIn .2s linear;
`;