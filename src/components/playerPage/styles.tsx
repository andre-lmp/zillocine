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

export const ContentDetailsWrapper = styled.div`
    max-width: 100%;
    display: flex;
    flex-direction: column;
    column-gap: 80px;
    padding-right: 16px;

    & p {
        display: flex;
        flex-direction: row;
        align-items: start;
        flex-wrap: wrap;
        box-sizing: border-box;
    }

    & p:not(:last-of-type) {
        padding-bottom: 50px;
        position: relative;
    }

    & div:first-of-type p:last-of-type {
        padding-bottom: 50px;
        position: relative;
    }

    & div:first-of-type p:last-of-type::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 25px;
        width: 100%;
        height: 1.4pt;
        background-color: rgba(255, 255, 255, 0.05);
    }

    & p:not(:last-of-type)::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 25px;
        width: 100%;
        height: 1.4pt;
        background-color: rgba(255, 255, 255, 0.05);
    }

    @media screen and (width >= 640px) {
        margin-left: 270px;
    }

    @media screen and (width >= 1024px) {
        flex-direction: row;

        & div:first-of-type p:last-of-type {
            padding-bottom: 0;
        }

        & div:first-of-type p:last-of-type::before {
            display: none;
        }
    }

`;