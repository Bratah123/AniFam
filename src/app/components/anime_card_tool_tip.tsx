'use client';
import { ReactNode, useRef } from 'react';

/*
 This client component is used to display tooltips on hover for media items.
*/

export interface AnimeToolTipProps {
  title: string;
  synopsis: string;
  rating: string;
  genres: string[];
  availableEpisodes: string;
  totalEpisodes: string;
}

interface Props extends AnimeToolTipProps {
  children: ReactNode;
}

function formatGenres(genres: string[]) {
  // (Optional) Use map arrow function to add <a href=""></a> to redirect to filter pages
  return genres.join(', ');
}

export const AnimeToolTip = ({
  children,
  title,
  synopsis,
  rating,
  genres,
  availableEpisodes,
  totalEpisodes,
}: Props) => {
  const tooltipReference = useRef<HTMLDivElement>(null);
  const containerReference = useRef<HTMLDivElement>(null);
  const totalEpisodesInt = parseInt(totalEpisodes);

  return (
    <div
      ref={containerReference}
      onMouseEnter={({ clientX, clientY }) => {
        if (!tooltipReference.current || !containerReference) return;
        const boundingRect =
          containerReference.current?.getBoundingClientRect();
        let left = 0.0;
        let top = 0.0;
        if (boundingRect) {
          ({ left, top } = boundingRect);
        }
        tooltipReference.current.style.left = `${clientX - left}px`;
        tooltipReference.current.style.top = `${clientY - top}px`;
      }}
      className="group relative inline-block"
    >
      {children}
      <div
        ref={tooltipReference}
        className="p2 invisible absolute rounded-lg bg-slate-600/90 opacity-0 transition group-hover:visible group-hover:z-50 group-hover:opacity-100"
      >
        <div className="flex w-72 flex-col p-2">
          <h3 className="eft flex1 text-left text-lg font-semibold text-slate-100">
            {title}
          </h3>
          <div className="mt-2 flex justify-between">
            <span className="text-left text-sm text-slate-200">
              &#11088; {rating}
            </span>
            <span className="text-right text-sm text-slate-200">
              Episodes: {availableEpisodes}/{totalEpisodesInt ? totalEpisodes : '?'}
            </span>
          </div>
          <p className="mt-3 line-clamp-5 flex-1 text-justify text-xs text-slate-300">
            {synopsis}
          </p>
          <div className="mt-2 flex-1">
            <span className="text-left text-xs text-slate-300">Genres: </span>
            <span className="text-left text-xs text-slate-200">
              {formatGenres(genres)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
