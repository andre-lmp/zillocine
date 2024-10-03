import styled from "styled-components";

export const CategoriesWrapper = styled.div`
    width: 100%;
    padding: 24px 16px;

    & ul {
        width: 100%;
        display: grid;
        grid-template-columns: repeat( auto-fill, minmax( 150px, 1fr ));
        list-style: none;
        gap: 15px;
        margin: 0;
    }

    & li { 
        border-radius: 4px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #16142B;
    }

    @media screen and ( width >= 768px ) {
        padding: 24px 24px;
    }

    @media screen and ( width >= 1024px ) {
        padding: 24px 32px;
    }
`;
