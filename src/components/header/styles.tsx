import styled from 'styled-components';

export const HeaderContainer = styled.header`
    width: 100%;
    height: 100px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;

    & ::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -10;
        background-image: linear-gradient(to bottom, #080C1E, rgba(8, 12, 30, 0.5), transparent);
    }
`;
