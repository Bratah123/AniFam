import Navbar from '@/app/components/navbar';
import { fetchAnyAvailSession } from '@/app/actions';
import { CommentSection } from '@/app/components/comment_section';
import TopicPageLayout from '@/app/components/topic_page_layout'; 

export default async function TopicPage(params: any) {
    console.log("Received params:", params);  // Debug log for incoming parameters
    const searchParams = params.searchParams;

    const res = await fetchAnyAvailSession('topicpage', {'title': searchParams.topic_title});
    console.log("Response from server:", res);  // Debug log for server response

    const { title, long_description, short_description } = res.topic || { title: 'Title Not Found', long_description: 'Description not available', short_description: '' };

    return (
        <div>
            <Navbar isAdmin={res.is_admin} onHome={false} onAdmin={false} onForums={true} />
            <br></br>
            <TopicPageLayout title={title} long_description={long_description || "Placeholder long description since it's not provided"} />
            <CommentSection />
        </div>
    );
}
