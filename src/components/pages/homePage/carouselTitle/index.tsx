'use client';

import { ReactNode, useEffect, useState } from 'react';

import './index.css';

type CarouselTitleProps = {
    children: ReactNode[] | ReactNode;
    type: 'normal' | 'focus';
};

export default function CarouselTitle( props: CarouselTitleProps ) {
    const [ isVisible, setIsVisible ] = useState( false );

    useEffect(() => {
        setIsVisible( true );
    }, []);

    return (
        <div style={{ opacity: isVisible ? 1 : 0 }}  className="title-container">
            { props.children }
        </div>
    );
};