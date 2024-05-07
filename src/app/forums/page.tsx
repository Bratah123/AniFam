import { fetchAnyAvailSession } from "@/app/actions";
import Navbar from '@/app/components/navbar';
import TopicButton from '@/app/components/topic_button';
import { TopicTable } from "@/app/components/topics_table";
import { ForumTitle } from "../components/forum_title";

export default async function Forums(params: any) {
  const res = await fetchAnyAvailSession('forums', params.searchParams);
  return (
    <div className="flex flex-col min-h-screen relative bg-slate-1000 bg-[url(/album_collage_1080.jpg)] bg-cover bg-center bg-no-repeat opacity-85">
      <Navbar isAdmin={res.is_admin} onHome={false} onForums={true} onAdmin={false} />
      <div className="py-4 px-4 bg-black bg-opacity-80 relative">
        <ForumTitle text="Ani X Family Forums" />
      </div>
      <div className="flex flex-grow items-center justify-center relative">
        <div className="text-center">
          <TopicButton text="Post Topic!" link="/forums/upload" />
          <TopicTable topicList={res?.topics} />
        </div>
      </div>
    </div>
  );
}
