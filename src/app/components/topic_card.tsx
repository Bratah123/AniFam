'use client'
import Link from 'next/link';
import { TopicToolTipProps } from '@/app/components/topic_card_tool_tip';

interface TopicCardProp extends TopicToolTipProps {
  topic_id: number;
  title: string;
  long_description: string;
  short_description: string;
}

export default function TopicCard({
  title,
  short_description,
}: TopicCardProp) {
  return (
    <div className="relative w-full h-full p-6 bg-cyan-500 bg-opacity-80 rounded-lg shadow-md hover:shadow-lg transition-opacity duration-300">
      <Link
        href={{
          pathname: '/topics',
          query: { topic_title: title },
        }}
        passHref
      >
        <div className="flex flex-col items-center justify-center text-center hover:cursor-pointer hover:bg-cyan-700 hover:bg-opacity-80 w-full h-full p-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="my-2 w-full border-b border-black"></div>
          <p className="text-sm text-white">{short_description}</p>
        </div>
      </Link>
    </div>
  );
}
