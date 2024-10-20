'use client';

import { useState } from "react";

import HeaderCarousel from "@/components/headerCarousel";
import Main from '@/components/homePage/main/index';

export default function HomePage() {
    const [ isPageLoaded, setIsPageLoaded ] = useState<boolean>( false )

    return (
        <section className="min-h-screen" >
            <HeaderCarousel isLoaded={setIsPageLoaded} currentPage="home"/>
            { isPageLoaded && <Main /> }
        </section>
    );
};