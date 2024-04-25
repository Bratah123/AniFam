import { fetchAnyAvailSession } from "@/app/actions";
import Navbar from '@/app/components/navbar';
import TopicButton from '../components/topic_button';
import TopicCard from "../components/topic_card";
import { TopicTable } from "../components/topics_table";

export default async function Forums(params: any) {
  const res = await fetchAnyAvailSession('forums', params.searchParams);

  return (
    <div className="flex flex-col h-screen relative bg-slate-1000 bg-[url(/album_collage_1080.jpg)] bg-cover bg-center bg-no-repeat opacity-85">
      <Navbar isAdmin={res?.is_admin} onHome={false} onForums={true} onAdmin={false} />
      <div className="py-4 px-4 bg-black bg-opacity-80 relative">
        <h1 className="text-5xl font-bold text-white text-center mb-4">Ani x Family Forums</h1>
      </div>
      <div className="flex flex-grow items-center justify-center relative">
        <div className="text-center">
          <TopicTable topicList={res?.topics} />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 mb-4 ml-4">
        <TopicButton text="Post Topic!" link="/forums/upload" />
      </div>
    </div>
  );
}
