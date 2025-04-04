import React from "react";
import generate from "../assets/generate.png"
import summary from "../assets/Summary.jpg"
import translate from "../assets/translate.png"
import { Link } from "react-router-dom";

const HomePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <div className="min-h-screen bg-gray-600 bg-cover bg-center"
            style={{ backgroundImage: "url('/background.jpeg')" }}

        >
            {/* Navbar */}
            <nav className="bg-black text-white flex justify-end p-4">
                {
                    user && (
                        <Link to={"/dashboard"} className="mr-4">Dashboard</Link>

                    )
                }
                <Link to={"/signup"} className="mr-4">Sign Up</Link>
                <Link to={"/login"}>Login</Link>

            </nav>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center py-20">
                {/* Title */}
                <h1 className="text-5xl font-bold text-black text-center">
                    AI-POWERED LEGAL DOCUMENTATION ASSISTANT
                </h1>

                {/* Options Section */}
                <div className="flex gap-10 text-black mt-52 ml-[800px]">
                    <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                        <img
                            src={translate}
                            alt={translate}
                            className="w-24 h-24 rounded-full bg-gray-300 p-2 shadow-lg"
                        />
                        <p className="mt-2 text-lg font-medium ">Translate Document</p>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                        <img
                            src={summary}
                            alt={summary}
                            className="w-24 h-24 rounded-full bg-gray-300 p-2 shadow-lg"
                        />
                        <p className="mt-2 text-lg font-medium ">Generate Summary</p>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                        <img
                            src={generate}
                            alt={generate}
                            className="w-24 h-24 rounded-full bg-gray-300 p-2 shadow-lg"
                        />
                        <p className="mt-2 text-lg font-medium ">Generate Document</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Option Card Component
const OptionCard = ({ image, title }) => {
    return (
        <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
            <img
                src={image}
                alt={title}
                className="w-24 h-24 rounded-full bg-gray-300 p-2 shadow-lg"
            />
            <p className="mt-2 text-lg font-medium text-white">{title}</p>
        </div>
    );
};

export default HomePage;
