'use client';

import styled from "styled-components";

type CarouselTitleProps = {
    children: string;
    type: 'normal' | 'focus';
};

const TitleContainer = styled.div`
    & .normal-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 4px;
    }

    & .focus-title {
        font-weight: 700;
        font-size: 30px;
        line-height: 40px;
        text-transform: uppercase;
    }

    @media screen and (width >= 1024) {
        & .normal-title {
            font-size: 20px;
        }

        & .focus-title {
            font-size: 40px;
        }
    }
`;

export default function CarouselTitle( props: CarouselTitleProps ) {
    return (
        <TitleContainer>
            <p className={`font-raleway ${props.type}-title`}>
                { props.children }
            </p>
        </TitleContainer>
    );
};