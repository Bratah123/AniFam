import Navbar from "@/app/components/navbar"
import { fetchAnyAvailSession } from "@/app/actions";
import Divider from "@/app/components/divider";

export default async function Home(params: any) {
    const res = await fetchAnyAvailSession('homepage', params.searchParams);
    return (
        <div className="h-screen bg-gradient-to-t from-black from-10% via-slate-800 via-40% to-sky-950 to-90% bg-scroll">
            <Navbar isAdmin={res.is_admin} onHome={true} onAdmin={false} onForums={false} />

            <div className="m-2 flex flex-col">
                <h2 className="flex pl-4 text-2xl">Hottest Hits!</h2>
                <Divider />
            </div>
        </div>
    );
}