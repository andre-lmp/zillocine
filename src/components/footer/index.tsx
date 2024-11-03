'use client';

// Hooks
import { useState, useEffect } from "react";

// Icones com React-icons
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

import Link from "next/link";

export default function Footer() {
    const [ isLoading, setIsLoading ] = useState( true );

    useEffect(() => {
        setIsLoading( false );
    } , []);

    return (
        <div style={{ opacity: isLoading ? 0 : 1 }} className="flex w-full gap-x-10 gap-y-5 flex-wrap-reverse bg-darkpurple justify-between items-center px-4 py-5 sm:flex-nowrap sm:py-6 md:px-6 lg:px-8 ease-linear duration-200">
            <p className="text-xl font-medium font-roboto order-1 whitespace-nowrap">Vitor Hugo</p>
            <div className="flex gap-x-5 items-center *:text-2xl order-2  sm:*:text-xl">
                {/* Meu linkedin */}
                <Link target="_blank" href={'https://www.linkedin.com/in/vitor-araujo-2054622a6'} rel="Link para o linkedin de vitor-araujo-2054622a6">
                    <FaLinkedin className="md:cursor-pointer"/>
                </Link>

                {/* Meu github */}
                <Link target="_blank" href={'https://www.github.com/888888b'} rel="Link para o github de 888888b">
                    <FaGithub className="md:cursor-pointer"/>
                </Link>

                {/* Meu instagram */}
                <Link target="_blank" href={'https://www.instagram.com/vitor_araujo621'} rel="Link para o instrgam de Vitor_araujo621">
                    <FaInstagram className="md:cursor-pointer"/>
                </Link>
            </div>
            <p className="text-xl font-medium font-roboto order-3 w-full text-right sm:w-fit">ZilloCine</p>
        </div>
    );
};