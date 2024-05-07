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
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-[-1rem] p-8 bg-transparent text-white hover:bg-transparent cursor-pointer w-full">
      {reversedTopics.map((topic, index) => (
        <div key={index} className="flex flex-col items-center w-full p-4 bg-cyan-700 text-black rounded-lg shadow-md">
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
