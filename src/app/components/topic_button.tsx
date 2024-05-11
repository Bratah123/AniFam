'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type ButtonProp = {
    text: string;
    link: string;
};

export default function TopicButton(prop: ButtonProp) {
    const router = useRouter();
    const [expand, setExpand] = useState(false);

    const handleClick = () => {
        setExpand(true);
        setTimeout(() => {
            router.push(prop.link);
        }, 600); // This allows for us to see the animation before the page changes
    };

    return (
        <div className="flex justify-center items-center w-full pt-1"> {/* Full-screen with padding */}
            <div className="w-[97%] p-4 bg-cyan-700 text-black rounded-lg shadow-md hover:shadow-lg transition-opacity duration-300 flex justify-center items-center"> {/* Centered button container */}
                <button
                    onClick={handleClick}
                    className={`w-full h-full bg-cyan-500 bg-opacity-80 text-white text-9xl font-semibold rounded-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 hover:bg-cyan-600 relative overflow-hidden ${expand ? 'expand' : ''}`}
                    aria-label={prop.text || "Add new topic"}>
                    +
                </button>
            </div>
            <style jsx>{`
                @keyframes expandEffect {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(50); 
                        opacity: 0; 
                    }
                }
                .expand {
                    animation: expandEffect 600ms forwards; 
                }
            `}</style>
        </div>
    );
}
