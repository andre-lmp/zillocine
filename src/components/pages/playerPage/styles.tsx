import styled from "styled-components";

export const ActorsCarouselWrapper = styled.div`
    position: relative;
    
    & .swiper-controllers {
        display: none;
    } 

    & .swiper-prev-slide {
        background-image: linear-gradient(to right, #16142b, rgba(22, 20, 43, 0.8), transparent );
    }

    & .swiper-next-slide {
        background-image: linear-gradient(to left, #16142b, rgba(22, 20, 43, 0.8), transparent );
    }

    @media screen and ( width >= 768px ) {
        &:hover .swiper-controllers {
            display: flex;
        }
    }
`;

export const CommentOptions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    column-gap: 20px;

    & button {
        border: none;
        outline: none;
    }
`;