'use client';

import React from "react";

interface TopicPageLayoutProps {
    title: string;
    long_description: string;
    user: string;
    children?: React.ReactNode;
}

export default function TopicPageLayout({
    title,
    long_description,
    user,
    children
}: TopicPageLayoutProps) {
    return (
        <div className="bg-gray-900 py-8 px-6 antialiased flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-start">
                <div style={{ width: "100px" }}> </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">{title}</h1>
                <div>{children}</div> 
            </div>
            <p className="text-sm lg:text-md text-gray-200">Author: <strong>{user}</strong></p>
            <p className="text-sm lg:text-md text-gray-300 mb-6">{long_description}</p>
        </div>
    );
}
