import React from 'react';
import TopicList from '@/app/components/topic_list';
import { fetchAnyAvailSession } from "@/app/actions";
import Navbar from '@/app/components/navbar';
import Link from 'next/link';

export default async function Forums(params: any) {
  const res = await fetchAnyAvailSession('forums', params.searchParams);
  // Basic mock topics for now
  const topics = [
    { id: 1, title: 'Announcements & Updates', description: 'Any changes and additions to AniFam!' },
    { id: 2, title: 'Favorite Anime of 2023', description: 'Share your top picks!' },
    { id: 3, title: 'Anime Recommendations', description: 'Looking for something new?' },
    // Add more mock topics as needed
  ];

  return (
    <div className="flex flex-col h-screen relative bg-slate-1000 bg-[url(/album_collage_1080.jpg)] bg-cover bg-center bg-no-repeat opacity-85">
      <Navbar isAdmin={res.is_admin} onHome={false} onForums={true} onAdmin={false} /> 
      <div className="py-8 px-4 bg-black bg-opacity-80 relative">
        <h1 className="text-5xl font-bold text-white text-center mb-4">Ani x Family Forums</h1>
      </div>
      <div className="flex-grow">
        <TopicList topics={topics} />
      </div>
      {/* Button to navigate to the homepage */}
      <Link href="/home">
        <button className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md">
          Go to Home
        </button>
      </Link>
    </div>
  );
};
