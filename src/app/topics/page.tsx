import Navbar from '@/app/components/navbar';
import { fetchAnyAvailSession } from '@/app/actions';
import { TopicCommentSection } from '@/app/components/topic_comment_section';
import TopicPageLayout from '@/app/components/topic_page_layout'; 
import { TopicCommentProps } from '@/app/components/topic_comment';
import DeleteTopicButton from '@/app/components/delete_topic_button';

function commentDataToTopicCommentProps(topicCommentData: any[]) {
    const topicCommentPropsList: TopicCommentProps[] = [];

    if (!topicCommentData || !Array.isArray(topicCommentData)) {
        console.error('Invalid or undefined topic comment data:', topicCommentData);
        return topicCommentPropsList; 
    }

    topicCommentData.forEach((comment, _) => {
        topicCommentPropsList.push({
            user: comment[2],
            comment: comment[3],
            date: comment[4],
            replies: comment[5],
        });
    });

    return topicCommentPropsList;
}

export default async function TopicPage(params: any) {
    const searchParams = params.searchParams;
    const res = await fetchAnyAvailSession('topicpage', {'title': searchParams.topic_title});
    const user = res.logged_in_as;
    const comments = res.comments;
    const { title, long_description, short_description } = res.topic || { title: 'Title Not Found', long_description: 'Description not available', short_description: '' };

    const commentsProps = commentDataToTopicCommentProps(comments);

    return (
        <div>
            <Navbar isAdmin={res.is_admin} onHome={false} onAdmin={false} onForums={true} />
            <br></br>
            <DeleteTopicButton text="Delete Topic" link={`/forums`} />
            <TopicPageLayout title={title} long_description={long_description || "Placeholder long description since it's not provided"} />
            <TopicCommentSection comments={commentsProps} user={user} topic_title={title} />
        </div>
    );
}
