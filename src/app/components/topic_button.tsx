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
        <div style={{
            position: 'fixed',  
            top: 0,             
            right: 0,         
            zIndex: 1000        
        }}>
            <button
                onClick={() => router.push(prop.link)}
                className="rounded bg-indigo-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out
                hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2">
                {prop.text}
            </button>
        </div>
    );
}