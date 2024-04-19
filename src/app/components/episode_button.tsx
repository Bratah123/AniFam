'use client';
/*
    This component is used to display a button that links to an episode
*/
type EpisodeButtonProps = {
  animeName: string;
  episode: string; // This is for queries so it can be 1 or 2 characters long
  visualEpisode: string; // This string is always at least 2 characters long
};

export default function EpisodeButton({
  episode,
  visualEpisode,
  animeName,
}: EpisodeButtonProps) {
  // Make an episode selection button that links to the episode page with the episode number but if there are more than 100 episodes, 
  // then make the button link to the episode page with the episode number and the total number of episodes
  // Use tailwind css for everything
  return (
    <div className="grid grid-rows-1">
      <a
        href={`/media?animeName=${animeName}&episode=${episode}`}
        className="w-full rounded bg-slate-500 p-2.5 text-slate-100 hover:cursor-pointer hover:bg-gray-700 active:bg-slate-500"
      >
        <h2>{visualEpisode}</h2>
      </a>
    </div>
  );
}
