import React from "react";
import Navbar from '@/app/components/navbar';
import { fetchAnyAvailSession } from '@/app/actions';
import { TopicCommentSection } from '@/app/components/topic_comment_section';
import TopicPageLayout from '@/app/components/topic_page_layout';
import { BasicTopicCommentProps } from '@/app/components/topic_comment';
import DeleteTopicButton from '@/app/components/delete_topic_button';

function commentDataToTopicCommentProps(topicCommentData: any[]): BasicTopicCommentProps[] {
    const topicCommentPropsList: BasicTopicCommentProps[] = [];

    if (!topicCommentData || !Array.isArray(topicCommentData)) {
        console.error('Invalid or undefined topic comment data:', topicCommentData);
        return topicCommentPropsList;
    }

    topicCommentData.forEach((comment) => {
        topicCommentPropsList.push({
            user: comment[2],
            comment: comment[3],
            date: comment[4],
            commentId: comment[0],
        });
    });

    return topicCommentPropsList;
}

export default async function TopicPage(params: any) {
    const searchParams = params.searchParams;
    const res = await fetchAnyAvailSession('topicpage', {'title': searchParams.topic_title }); 
    const current_user = res.logged_in_as;
    const comments = res.comments;
    const { title, long_description, user } = res.topic || { title: 'Title Not Found', long_description: 'Description not available', short_description: '' };

    const commentsProps = commentDataToTopicCommentProps(comments);

    return (
        <div className="bg-gray-900">
            <Navbar isAdmin={res.is_admin} onHome={false} onAdmin={false} onForums={true} />
            <TopicPageLayout title={title} long_description={long_description || "Placeholder long description since it's not provided"} user={user}>
                <div style={{ position: 'relative', top: '-20px' }}> 
                    <DeleteTopicButton text="Delete Topic" topicTitle={title} />
                </div>
            </TopicPageLayout>
            <TopicCommentSection comments={commentsProps} user={current_user} topic_title={title} />
        </div>
    );
}