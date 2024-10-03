import styled from "styled-components";

export const headerSlides = styled.div`
    width: 100%;
    height: auto;
    position: relative;

    & .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
        background-image: linear-gradient( to top, #020515, #020515, rgba(2, 5, 21, 0.3), transparent);
    }

    @media screen and ( width >= 768px ) {
        & .overlay {
            height: 70%;
            background-image: linear-gradient( to top, #020515, rgba(2, 5, 21, 0.9), rgba(2, 5, 21, 0.5), transparent);
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

    & .swiper-pagination-bullet, .swiper-pagination-bullet-active {
        --swiper-pagination-bullet-size: 8px;
        --swiper-pagination-color: white;
        --swiper-pagination-bullet-inactive-color: white;
    }
`;