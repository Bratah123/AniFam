import Navbar from '@/app/components/navbar';
import { fetchAnyAvailSession } from '@/app/actions';
import AnimePlayer from '@/app/components/anime_player';
import Divider from '@/app/components/divider';
import EpisodeButton from '@/app/components/episode_button';
import { CommentSection } from '@/app/components/comment_section';
import Image from 'next/image';

function initEpisodeButtonData(animeName: string, episodes: string[]) {
    const episodeNavButtons: any[] = [];

    episodes.forEach((episode, _) => {
        let visualEpisode = episode;
        let intEpisode = parseInt(episode);
        if (intEpisode < 10) {
            visualEpisode = '0' + episode;
        }
        episodeNavButtons.push({
            episode: episode,
            visualEpisode: visualEpisode,
            animeName: animeName,
        });
    });

    return episodeNavButtons;
}

// THIS IS THE IP OF THE FLASK SERVER THAT SERVES THE VIDEOS
// CHANGE THIS TO THE Public ipv4 address of the machine this is running on
// if you want this web app to work in a public setting.
const VIDEO_SERVER_IP = '127.0.0.1';

export default async function MediaPage(params: any) {
    const searchParams = params.searchParams;

    const result = await fetchAnyAvailSession('mediapage', {'animeName': searchParams.animeName});
    const episodes = result.episodes;
    const episode = searchParams.episode;
    const animeName = searchParams.animeName;
    const episodeButtonData = initEpisodeButtonData(animeName, episodes);
    
    return (
        <div>
            <Navbar isAdmin={result.is_admin} onHome={false} onAdmin={false} onForums={false} />
            <br></br>
            <h2 className="flex pl-4 text-2xl font-bold">
                {animeName + ' Episode ' + episode}
            </h2>
            <br></br>
            <Divider />
            <br></br>
            <div className="flex justify-center">
                <div className="max-w-md rounded bg-gray-800 p-2 shadow-lg">
                    <div className="mb-2 text-sm font-bold">List of episodes:</div>
                    <div className={`md:grid md:grid-cols-5 md:gap-1`}>
                        {episodeButtonData.map((episodeNavButton, index) => (
                        <EpisodeButton
                            key={index}
                            episode={episodeNavButton.episode}
                            visualEpisode={episodeNavButton.visualEpisode}
                            animeName={episodeNavButton.animeName}
                        />
                        ))}
                    </div>
                </div>
                {episode === '0' ? (
                    <>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="text-center text-2xl font-bold text-slate-100">
                        Sorry, no episodes found for this anime yet.
                        <br />
                        Please try again later!
                      </h2>
                      <Image
                        src="/anya_scared.jpg"
                        alt="Anya Scared"
                        width={960}
                        height={540}
                      />
                    </div>
                  </>
                ) : (
                    <AnimePlayer videoPath={`http://${VIDEO_SERVER_IP}:5328/static/${animeName}/E${episode}.mp4`}/>
                )}
            </div>
            <CommentSection />
        </div>
    );
}