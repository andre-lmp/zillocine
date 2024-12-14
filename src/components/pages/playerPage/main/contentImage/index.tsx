'use client';

import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

type ImageProps = {
    url: string;
    title: string;
};

export default function ContentImage( props: ImageProps ) {
    return (
        <LazyLoadImage
            src={`https://image.tmdb.org/t/p/original${props.url}`}
            alt={`${props.title} movie/serie presentation image`}
            width={'100%'}
            height={'100%'}
            effect="opacity"
            placeholderSrc={`https://image.tmdb.org/t/p/w92/${props.url}`}
            className='w-40 sm:w-60 h-full object-cover bg-darkpurple image rounded'
        />
    );
};