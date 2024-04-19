import Navbar from '@/app/components/navbar';
import { fetchAnyAvailSession } from '@/app/actions';
import AnimePlayer from '@/app/components/anime_player';

// THIS IS THE IP OF THE FLASK SERVER THAT SERVES THE VIDEOS
// CHANGE THIS TO THE Public ipv4 address of the machine this is running on
// if you want this web app to work in a public setting.
const VIDEO_SERVER_IP = '127.0.0.1';

export default async function MediaPage(params: any) {
    const searchParams = params.searchParams;

    const result = await fetchAnyAvailSession('mediapage', {'animeName': searchParams.animeName});
    const episodes = result.episodes;

    const animeName = searchParams.animeName;

    return (
        <div>
        <Navbar isAdmin={result.is_admin} onHome={false} onAdmin={false} onForums={false} />
        <h1>You are supposed to be watching: {animeName}</h1>
        <AnimePlayer videoPath={`http://${VIDEO_SERVER_IP}:5328/static/${animeName}/E1.mp4`}/>
        </div>
    );
}