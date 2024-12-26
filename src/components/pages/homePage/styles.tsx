import styled from 'styled-components';

export const TrendingImageContainer = styled.div`
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
`;