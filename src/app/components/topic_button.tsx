'use client';
import React from "react";
import {useRouter} from "next/navigation";

type ButtonProp = {
    text: string;
    link: string;
};
export default function TopicButton(prop: ButtonProp) {
    const router = useRouter();

    return (
        <div className="w-full p-4 bg-cyan-700 text-black rounded-lg shadow-md hover:shadow-lg transition-opacity duration-300">
        <button
            onClick={() => router.push(prop.link)}
            className="w-full h-full bg-cyan-500 bg-opacity-80 text-white text-9xl font-semibold rounded-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 hover:bg-cyan-600"
            aria-label={prop.text || "Add new topic"}>
            +
        </button>
    </div>
);
}