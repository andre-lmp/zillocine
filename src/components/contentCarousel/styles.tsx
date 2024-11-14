import styled from "styled-components";

export const imageBox = styled.div`
    width: 100%;
    height: 100%;
    background-color: #16142b;

    & .slide-wrapper {
        position: relative;
    }

    & .slide-wrapper::before {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        background-image: radial-gradient( ellipse, #16142b, transparent, transparent );
        /* background-image: radial-gradient( 225deg, #16142b, #16142b, transparent ); */
        z-index: 10;
    }

    & .image, .image-container {
        transition: transform .2s ease-in-out; 
    }

    & .play-icon {
        transition: opacity .2s linear .2s;
    }

    & .play-icon {
        opacity: 0;
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

    & .favorited {
        display: none;
    }

    & .not-favorited {
        display: inline;
    }

    & .favorite-button .favorited {
        display: inline;
    }

    & .favorite-button .not-favorited {
        display: none;
    }

    @media screen and ( width >= 768px ) {
        &:hover .description {
            opacity: 1;
            transform: translateY(0%);
        } 

        &:hover .image-container {
            transform: translate(-20%, -20%) scale(0.5);
            border-radius: 6px;
        }

        &:hover .image {
            opacity: 50%;
        }

        &:hover .play-icon {
            opacity: 100%;
        }

        & .slide-wrapper::before {
            display: none;
        }

        & button {
            transform: translateX(100%);
            transition: all .2s ease-in-out;
        }

        &:hover button {
            transform: translateX(0);
        }
    }

`;

export const SwiperContainer = styled.div`
    width: 100%;
    position: relative;

    & .swiper-controllers {
        display: none;
        justify-content: center;
        align-items: center;
    }

    @media screen and ( width >= 768px ) {
        &:hover .swiper-controllers {
            display: flex;
        }
    }
`;