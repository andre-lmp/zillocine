'use client';

import styled from "styled-components";

export const imageBox = styled.div`
    width: 100%;
    background-color: #16142b;
    position: relative;
    border-radius: 6px;
    overflow: hidden;

    & div:first-of-type::before {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        background-image: radial-gradient( ellipse, #16142b, transparent, transparent );
        z-index: 10;
    }

    & div:first-of-type {
        transition: all 0.15s linear;
    };

    & .play-icon {
        transition: all 0.15s linear;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: scale(0) translate(-50%, -50%);
        z-index: 20;
        font-size: 36px;
        cursor: pointer;
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

       &:hover div:first-of-type {
            transform: scale(1.5);
            filter: blur(3px);
       }       

       &:hover div:first-of-type .image {
            opacity: 50%;
       }

        &:hover .play-icon {
            opacity: 100%;
            transform: scale(1) translate(-50%, -50%);
        }

        & .slide-wrapper::before {
            display: none;
        }

        & button {
            transform: translateX(100%);
            transition: all .15s linear;
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

export const ContentWrapper = styled.section`
    @keyframes FadeIn {
        from { opacity: 0 }
        to { opacity: 100% }
    };

    animation: FadeIn 0.2s linear;
`;