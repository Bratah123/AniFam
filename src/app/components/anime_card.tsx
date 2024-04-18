'use client';
/*
 This client component is used to display a row of media items.
 This component represents every single "anime card" you see in the homepage.
*/
import Image from 'next/image';
import Link from 'next/link';
import { AnimeToolTip, AnimeToolTipProps } from '@/app/components/anime_card_tool_tip';

const WIDTH = 300;
const HEIGHT = 450; // This doesn't actually do anything because the image is cropped to fit the width

interface AnimeCardProp extends AnimeToolTipProps {
  image: string;
}

export default function AnimeCard({
  image,
  title,
  episodes,
  totalEpisodes,
  synopsis,
  rating,
  genres,
}: AnimeCardProp) {
  return (
    <div className="relative">
      <AnimeToolTip
        title={title}
        synopsis={synopsis}
        rating={rating}
        genres={genres}
        episodes={episodes}
        totalEpisodes={totalEpisodes}
      >
        <Link
          href={{
            pathname: '/media',
            query: {
              animeName: title,
              totalEpisodes: episodes.length,
            },
          }}
          className="flex flex-col text-center hover:cursor-pointer hover:bg-gray-700"
        >
          <Image
            src={image}
            alt="Image of a Clickable Media Item"
            width={WIDTH}
            height={HEIGHT}
            className="100vw rounded hover:cursor-pointer hover:brightness-150"
            style={{ minHeight: '450px', maxHeight: '450px' }} // This is to prevent not all images being the same height
          />
          <h2>{title}</h2>
        </Link>
      </AnimeToolTip>
    </div>
  );
}
