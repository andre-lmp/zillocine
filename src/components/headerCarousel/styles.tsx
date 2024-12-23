import styled from "styled-components";

export const HeaderSlides = styled.div`
    width: 100%;
    height: auto;
    position: relative;

    @keyframes FadeIn {
        from { opacity: 0 }
        to { opacity: 1 }   
    }

    animation: FadeIn .2s linear;

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
        background-color: #16142B;
        margin-top: 80px;
        
        & .overlay {
            left: 50%;
            width: 90px;
            transform: translateX(-50%);
            background-image: linear-gradient( to right, #16142B, #16142B, transparent);
        }

        & .slide-container::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 50vw;
            height: 100%;
            background-image: linear-gradient( to right, #16142B, transparent);
            z-index: 12;
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

export const IntroPosterWrapper = styled.div`
    width: 100vw; 
    position: relative;
    height: 660px;
    overflow: hidden;

    & .intro_poster {
        transform: skew(15deg);
        opacity: 70%;
        filter: blur(2px);
    }

    @media (min-width: 768px) {
        height: 400px;
    }

    @media (min-width: 1280px) {
        height: 420px;
    }
`;