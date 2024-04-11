import Navbar from "@/app/components/navbar"
import { fetchAnyAvailSession } from "@/app/actions";

export default async function Home(params: any) {
    const res = await fetchAnyAvailSession('homepage', params.searchParams);
    return (
        <div className="h-screen bg-gradient-to-t from-black from-10% via-slate-800 via-40% to-sky-950 to-90% bg-scroll">
            <Navbar isAdmin={res.is_admin} />
            <h1>You Logged in!</h1>
        </div>
    );
}