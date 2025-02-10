"use client";

// Hooks
import { useState, useEffect } from "react";

// Icones com React-icons
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

import Link from "next/link";

export default function Footer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div
      style={{ opacity: isLoading ? 0 : 1 }}
      className="flex flex-col w-full gap-x-10 gap-y-5 bg-darkpurple justify-center items-center px-4 py-5 sm:flex-nowrap sm:py-6 md:px-6 lg:px-8 ease-linear duration-200"
    >
      <p className="text-xl font-medium font-roboto  w-full sm:w-fit">IFDB</p>

      <p>&#169; 2025 Instituto Federal do Tocantins</p>
    </div>
  );
}
