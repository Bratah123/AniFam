import Navbar from "@/app/components/navbar"
import { fetchAnyAvailSession } from "@/app/actions";
import Divider from "@/app/components/divider";
import { AnimeTable } from "@/app/components/anime_table";

export default async function Home(params: any) {
    const res = await fetchAnyAvailSession('homepage', params.searchParams);
    let searchParam = params.searchParams['search'];
    if (!searchParam) {
        searchParam = '';
    }
    let sectionName = (searchParam === '') ? 'Hottest Hits!' : `Search results for "${searchParam}"`;

    return (
        <div className="h-screen bg-gradient-to-t from-black from-10% via-slate-800 via-40% to-sky-950 to-90% bg-scroll">
            <Navbar isAdmin={res.is_admin} onHome={true} onAdmin={false} onForums={false} />
            <div className="m-2 flex flex-col">
                <h2 className="flex pl-4 text-2xl">{sectionName}</h2>
                <Divider />
                <AnimeTable animeList={res.hottest_hits} />
            </div>
        </div>
    );
}