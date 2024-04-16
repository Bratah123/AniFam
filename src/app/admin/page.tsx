import Navbar from '@/app/components/navbar';
import UserList from '@/app/components/user_list';
import LinkButton from "@/app/components/link_button";

export default async function Admin() {
    return (
        <div
            className="h-screen bg-gradient-to-t from-black from-10% via-slate-800 via-40% to-sky-950 to-90% bg-scroll space-y-6">
            <Navbar isAdmin={true} onAdmin={true} onHome={false} onForums={false}/>
            <UserList/>
            <div className="mx-auto max-w-screen-md rounded-lg bg-gray-950 px-5 py-8 shadow-lg md:px-10 space-y-6">
                <h1 className="text-3xl font-bold text-center text-white">Admin Tools</h1>
                <div className="flex justify-between">
                    <LinkButton text="Upload Anime" link="/admin/upload"/>
                </div>
            </div>
        </div>
    );
}