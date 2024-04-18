'use client';
import AnimeCard from '@/app/components/anime_card';

export interface AnimeMetadata {
  title: string;
  image: string;
  rating: string;
  episodes: string[];
  total_episodes: string;
  synopsis: string;
  genres: string[];
}

interface Props {
  animeList: AnimeMetadata[];
}

export function AnimeTable({ animeList }: Props) {
  return (
    <div className="mt-2 grid grid-flow-row auto-rows-max justify-around gap-4 pl-4 pr-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-6">
      {animeList.map((anime, index) => (
        <AnimeCard
          key={index}
          image={anime.image}
          title={anime.title}
          episodes={anime.episodes}
          totalEpisodes={anime.total_episodes}
          synopsis={anime.synopsis}
          rating={anime.rating}
          genres={anime.genres}
        />
      ))}
    </div>
  );
}
