import { ReactNode } from 'react';

import './index.css';

type CarouselTitleProps = {
    children: ReactNode[] | ReactNode;
    type: 'normal' | 'focus';
};

export default function CarouselTitle( props: CarouselTitleProps ) {
    return (
        <div className="title-container">
            { props.children }
        </div>
    );
};