'use client'
import Link from 'next/link';
import { TopicToolTip, TopicToolTipProps } from '@/app/components/topic_card_tool_tip';


const WIDTH = 300; 
const HEIGHT = 450; 

interface TopicCardProp extends TopicToolTipProps{
  topic_id: number;
  title: string;
  long_description: string;
  short_description: string;
}

export default function TopicCard({
  topic_id,
  title,
  long_description,
  short_description,
}: TopicCardProp) {
  return (
    <div className="relative">
      <TopicToolTip
        title={title}
        long_description={long_description}
        short_description={short_description}
      >
        <Link
          href={{
            pathname: '/topic',
            query: { topic_id: topic_id },
          }}
          className="flex flex-col text-center hover:cursor-pointer hover:bg-gray-700"
        >
            <h2>{title}</h2>    
        </Link>
      </TopicToolTip>
    </div>
  );
}
