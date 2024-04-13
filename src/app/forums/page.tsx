import React from 'react';
import TopicList from '@/app/components/topic_list';

const Home: React.FC = () => {
  // Basic mock topics for now
  const topics = [
    { id: 1, title: 'Announcements & Updates', description: 'Any changes and additions to AniFam!' },
    { id: 2, title: 'Favorite Anime of 2023', description: 'Share your top picks!' },
    { id: 3, title: 'Anime Recommendations', description: 'Looking for something new?' },
    // Add more mock topics as needed
  ];

  return (
    <div className="flex h-screen justify-center items-center bg-slate-1000 bg-[url(/anime_spyxfamily_officialart_souvenir.jpg)] bg-cover bg-center bg-no-repeat opacity-85">
      <div className="mt-25 absolute top-0 left-0 w-full text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Ani x Family Forums</h1>
      </div>
      <div className="text-left bg-left opacity-100 items-left text-3xl font-bold mb-0 bg-slate-1000 bg-opacity-90">
        <TopicList topics={topics} />
      </div>
    </div>
  );
};

export default Home;
