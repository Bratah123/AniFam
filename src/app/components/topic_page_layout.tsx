'use client';

interface TopicPageLayoutProps {
    title: string;
    long_description: string;
    user: string;
}

export default function TopicPageLayout({
    title,
    long_description,
    user
}: TopicPageLayoutProps) {
    return (
        <div className="bg-gray-900 py-8 px-6 antialiased flex flex-col items-center justify-center">
                <div className="p-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">{title}</h1>
                    <p className="text-sm lg:text-md  text-gray-200">Author: <strong>{user}</strong></p>
                    <p className="text-sm lg:text-md  text-gray-300 mb-6">{long_description}</p>
                </div>
                <div className="px-6 pb-6">
                </div>
        </div>
    );
}
