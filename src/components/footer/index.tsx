import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="flex w-full gap-x-10 gap-y-5 flex-wrap-reverse bg-darkpurple justify-between items-center px-4 py-5">
            <p className="text-xl font-medium font-roboto order-1">Vitor Hugo</p>
            <div className="flex gap-x-5 items-center *:text-2xl order-2">
                <FaLinkedin/>
                <FaGithub/>
                <FaInstagram/>
            </div>
            <p className="text-xl font-medium font-roboto order-3 w-full text-right">ZilloCine</p>
        </div>
    );
};