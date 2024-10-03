import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="flex w-full gap-x-10 gap-y-5 flex-wrap-reverse bg-darkpurple justify-between items-center px-4 py-5 sm:flex-nowrap sm:py-6 md:px-6 lg:px-8">
            <p className="text-xl font-medium font-roboto order-1 whitespace-nowrap">Vitor Hugo</p>
            <div className="flex gap-x-5 items-center *:text-2xl order-2  sm:*:text-xl">
                <FaLinkedin className="md:cursor-pointer"/>
                <FaGithub className="md:cursor-pointer"/>
                <FaInstagram className="md:cursor-pointer"/>
            </div>
            <p className="text-xl font-medium font-roboto order-3 w-full text-right sm:w-fit">ZilloCine</p>
        </div>
    );
};