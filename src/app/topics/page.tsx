import Navbar from '@/app/components/navbar';
import { fetchAnyAvailSession } from '@/app/actions';
import { CommentSection } from '@/app/components/comment_section';


export default async function TopicPage(params: any) {
    const searchParams = params.searchParams;

    const res = await fetchAnyAvailSession('topicpage', {'title': searchParams.title});

    return (
        <div>
            <Navbar isAdmin={res.is_admin} onHome={false} onAdmin={false} onForums={false} />
            <br></br>
            <div className="flex flex-col h-screen relative bg-slate-1000 bg-[url(/album_collage_1080.jpg)] bg-cover bg-center bg-no-repeat opacity-85">
            <div className="py-4 px-4 bg-black bg-opacity-80 relative">
                <h1 className="text-5xl font-bold text-white text-center mb-4">Ani x Family Topics</h1>
            </div>
            <div className="flex-grow relative">
                <div className="grid grid-cols-1 gap-4 p-4">  
                </div>
            </div>
        </div>
        <CommentSection/>
        </div>
    );
}