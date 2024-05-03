'use client';
import { TopicComment, TopicCommentProps } from '@/app/components/topic_comment';
import { FormEvent, useState } from 'react';
import { uploadTopicComment } from '@/app/actions';

export interface TopicCommentSectionProps {
    comments: TopicCommentProps[];
    user: string;
    topic_title: string;
}

export function TopicCommentSection(commentSectionProps: TopicCommentSectionProps) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(commentSectionProps.comments || []);

    let amountOfComments = commentSectionProps.comments.length;

    async function onCommentSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const res = await uploadTopicComment(commentSectionProps.topic_title, comment);
        if (res.status === 200) {
            alert('Comment posted successfully');
            // Clear the comment box
            setComment('');
            // Update the comments and add to the top of the list
            setComments([{
                user: commentSectionProps.user,
                comment: comment,
                date: new Date().toISOString(),
                replies: [],
            }, ...comments]);
        } else {
            alert(res.message);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-8 px-6 antialiased">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Comments ({amountOfComments})</h2>
            </div>
            <form className="mb-6" onSubmit={onCommentSubmit}>
                <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="comment" className="sr-only">Your comment</label>
                    <textarea id="comment" rows={6}
                        className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Write a comment..." required
                        onChange={
                            (e) => {
                                setComment(e.target.value);
                            }
                        } value={comment}></textarea>
                </div>
                <button
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-400 rounded-lg">
                    Post comment
                </button>
            </form>
            {comments.map((comment, index) => (
                <TopicComment key={index} user={comment.user} comment={comment.comment} date={comment.date} replies={comment.replies} />
            ))}
        </div>
    );
}


