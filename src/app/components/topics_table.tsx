'use client';
import { useState, useEffect } from 'react';
import TopicCard from '@/app/components/topic_card';

export interface Topic {
  topic_id: number;
  title: string;
  long_description: string;
  short_description: string;
  user: string;
}

interface Props {
  topicList: Topic[];
}

export function TopicTable({ topicList = [] }: Props) {
  const [reversedTopics, setReversedTopics] = useState<Topic[]>([]);
  useEffect(() => {
    // Set the reversed topics only once on component mount
    setReversedTopics([...topicList].reverse());
  }, [topicList]); 

  const [rotations, setRotations] = useState<{ [key: number]: number }>({});

  const handleMouseMove = (topicId: number, event: { currentTarget: any; clientX: number; }) => {
    const card = event.currentTarget;
    const { clientX } = event;
    const { left, width } = card.getBoundingClientRect();
    const position = (clientX - left) / width;
    const angle = (position - 1.5) * 10;
    setRotations(prev => ({ ...prev, [topicId]: angle }));
  };

  const handleMouseLeave = (topicId: number) => {
    setRotations(prev => ({ ...prev, [topicId]: 0 }));
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-[-1rem] p-8 bg-transparent text-white hover:bg-transparent cursor-pointer w-full">
      {reversedTopics.map((topic, index) => (
        <div 
          key={index} 
          onMouseMove={(e) => handleMouseMove(topic.topic_id, e)}
          onMouseLeave={() => handleMouseLeave(topic.topic_id)}
          style={{ 
            transform: `rotateY(${rotations[topic.topic_id] || 0}deg) scale(${rotations[topic.topic_id] ? 1.05 : 1})`, 
            transition: 'transform 0.5s ease-out'
          }}
          className="flex flex-col items-center w-full p-4 bg-cyan-700 rounded-lg shadow-md hover:shadow-lg transition-opacity duration-300 hover:bg-cyan-700 hover:bg-opacity-80"
        >
          <TopicCard
            topic_id={topic.topic_id}
            title={topic.title}
            short_description={topic.short_description}
            long_description={topic.long_description}
            user={topic.user}
          />
        </div>
      ))}
    </div>
  );  
}
