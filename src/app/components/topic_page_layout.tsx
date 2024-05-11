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
            <div className="w-full flex justify-between items-center"> 
                <div style={{ flex: 1 }}> 
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ flex: 2, textAlign: 'center' }}>
                    {title}
                </h1>
                <div style={{ flex: 1 }}> 
                    {children}
                </div>
            </div>
            <p className="text-sm lg:text-md text-gray-200" style={{ paddingBottom: '20px' }}>Author: <strong>{user}</strong></p>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', padding: '0 200px' }}>
                <p className="text-sm lg:text-md text-gray-300 mb-6" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {long_description}
                </p>
            </div>
        </div>
    );
}
