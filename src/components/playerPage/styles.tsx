import styled from "styled-components";

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

    @media screen and ( width >= 768px ) {
        & .overlay {
            height: 40%;
            background-image: linear-gradient( to top, #020515, rgba(2, 5, 21, 0.7), rgba(2, 5, 21, 0.3), transparent);
        }

        & .second-overlay {
            width: 500px;
            height: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 10;
            background-image: linear-gradient( to right, #020515, rgba(2, 5, 21, 0.5), transparent);   
        }
    }

    @media screen and ( width >= 1024px ) {
        & .second-overlay {
            width: 800px;
            background-image: linear-gradient( to right, #020515, rgba(2, 5, 21, 0.5), transparent);   
        }
    }
`;