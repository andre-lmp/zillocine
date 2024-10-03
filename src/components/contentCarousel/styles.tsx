import styled from "styled-components";

export const imageBox = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #16142b;

    & .image {
        transition: transform .2s ease-in-out; 
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

    @media screen and ( width >= 768px ) {
        &:hover .description {
            opacity: 1;
            transform: translateY(0%);
        } 

        &:hover .image {
            transform: translateY(-20%) scale(0.5);
            border-radius: 6px;
        }
    }

`;