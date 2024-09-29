'use client';

import HeaderCarousel from "@/components/headerCarousel";
import Main from '@/components/homePage/main/index';

import { useState } from "react";

export default function HomePage() {
    const [ isPageLoaded, setIsPageLoaded ] = useState<boolean>( false )

    return (
        <section className="min-h-dvh" >
            <HeaderCarousel isLoaded={setIsPageLoaded} currentPage="home"/>
            { isPageLoaded && <Main /> }
        </section>
    );
};