// 'use client';
import TopicCard from '@/app/components/topic_card';

export interface Topic {
  topic_id: number;
  title: string;
  long_description: string;
  short_description: string;
}

interface Props {
  topicList: Topic[];
}

export function TopicTable({ topicList }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-8 bg-cyan-400 text-white hover:bg-cyan-500 cursor-pointer">
      {topicList.map((topic, index) => (
        <div key={index} className="flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 bg-white text-black rounded-lg shadow-md">
          <TopicCard
            topic_id={topic.topic_id}
            title={topic.title}
            short_description={topic.short_description}
            long_description={topic.long_description}
          />
        </div>
      ))}
    </div>
  );
}


