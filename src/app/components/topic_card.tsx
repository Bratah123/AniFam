'use client';
import Link from 'next/link';
import Image from 'next/image'; 
import { TopicToolTipProps } from '@/app/components/topic_card_tool_tip';
import { useState } from 'react';

interface TopicCardProp extends TopicToolTipProps {
  topic_id: number;
  title: string;
  short_description: string;
  user: string;
}

export default function TopicCard({
  title,
  short_description,
  user,
}: TopicCardProp) {
  const [rotation, setRotation] = useState(0);

  const handleMouseMove = (event: { currentTarget?: any; clientX?: any; }) => {
    const card = event.currentTarget;
    const { clientX } = event;
    const { left, width } = card.getBoundingClientRect();
    const position = (clientX - left) / width; 
    const angle = (position - 0.5) * 10; 
    setRotation(angle);
  };

  const handleMouseLeave = () => {
    setRotation(0);
  };

  return (
    <div
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    style={{ transform: `rotateY(${rotation}deg)`, transition: 'transform 0.1s' }}
    className="relative w-full h-full bg-cyan-500 bg-opacity-80 rounded-lg shadow-md hover:shadow-lg transition-opacity duration-300"
    >
      <div className="p-6">
        <div className="absolute top-0 left-0">
          <Image
            src="/anya_chibi_t.png"
            alt="Anya chibi image"
            width={25} 
            height={25} 
            className="rounded-lg"
          />
        </div>
        <div className="user-box absolute top-0 right-0 p-2 bg-blue-500 text-gray-900 rounded-lg">
          Posted by: {user}
        </div>
        <Link
          href={{
            pathname: '/topics',
            query: { topic_title: title, short_description, user },
          }}
          passHref
        >
          <div className="flex flex-col items-start justify-start text-left hover:cursor-pointer hover:bg-opacity-80 w-full h-full">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <div className="my-2 w-full border-b border-black"></div>
            <p className="text-sm text-white">{short_description}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
