'use client';

interface TopicPageLayoutProps {
    title: string;
    long_description: string;
}

export default function TopicPageLayout({
    title,
    long_description
}: TopicPageLayoutProps) {
    return (
        <div className="bg-white dark:bg-gray-900 py-8 px-6 antialiased flex flex-col items-center justify-center">
            <div className="relative w-full max-w-xl text-center hover:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
                    <p className="text-sm lg:text-md text-gray-600 dark:text-gray-300 mb-6">{long_description}</p>
                </div>
                <div className="bg-gray-200 dark:bg-gray-800 w-full h-64 rounded-t-lg flex items-center justify-center">
                </div>
                <div className="px-6 pb-6">
                </div>
            </div>
        </div>
    );
}
