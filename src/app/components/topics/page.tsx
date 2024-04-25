import Navbar from '@/app/components/navbar';
import { fetchAnyAvailSession } from '@/app/actions';


function initTopicButtonData(topic_id: string, topics: any[]) {
    const topicButtons: any[] = [];

    topics.forEach((topic, _) => {
        topicButtons.push({
            topic_id: topic_id,
            title: topic.title,
            long_description: topic.long_description,
            short_description: topic.short_description,
        });
    });

    return topicButtons;
}

export default async function TopicsPage(params: any) {
    const searchParams = params.searchParams;
    const res = await fetchAnyAvailSession('topics',{'topic_id': searchParams.topic_id});
    const topics = res.topics;
    const topic_id = searchParams.topic_id;
    const topicButtonData = initTopicButtonData(topic_id, topics);
    return (
        <div className="flex flex-col h-screen relative bg-slate-1000 bg-[url(/album_collage_1080.jpg)] bg-cover bg-center bg-no-repeat opacity-85">
            <Navbar isAdmin={res?.is_admin} onHome={false} onForums={true} onAdmin={false} />
            <div className="py-4 px-4 bg-black bg-opacity-80 relative">
                <h1 className="text-5xl font-bold text-white text-center mb-4">Ani x Family Topics</h1>
            </div>
            <div className="flex-grow relative">
                <div className="grid grid-cols-1 gap-4 p-4">
                    {topicButtonData.map((topic: any, index: number) => (
                        <div key={index} className="bg-gray-950 p-4 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold">{topic.title}</h2>
                            <p className="text-lg">{topic.short_description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}