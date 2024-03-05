import React from 'react';
import TopicList from '@/app/components/topic_list';

const Home: React.FC = () => {
  // basic mock topics for now hi brandon
  const topics = [
    { id: 1, title: 'Favorite Anime of 2023', description: 'Share your top picks!' },
    { id: 2, title: 'Anime Recommendations', description: 'Looking for something new?' },
    // Add more mock topics as needed
  ];

  return (
    <div>
      <h1>Anime Forum</h1>
      <TopicList topics={topics} />
    </div>
  );
};

export default Home;
