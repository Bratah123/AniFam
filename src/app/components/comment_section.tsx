'use client';
import { MediaComment, MediaCommentProps } from '@/app/components/media_comment';
import { FormEvent, useState } from 'react';
import { uploadComment } from '@/app/actions';

/*
* CSS taken from https://flowbite.com/blocks/publisher/comments/ and modified to fit the project
*/
export interface CommentSectionProps {
    comments: MediaCommentProps[];
    user: string;
    animeName: string;
    episode: string;
}


export function CommentSection(commentSectionProps: CommentSectionProps) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(commentSectionProps.comments);

    let amountOfComments = commentSectionProps.comments.length;

    async function onCommentSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const res = await uploadComment(commentSectionProps.animeName, commentSectionProps.episode, comment);
        if (res.status === 200) {
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
        <div className="bg-gray-900 py-8 px-6 antialiased">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-white">Comments ({amountOfComments})</h2>
            </div>
            <form className="mb-6" onSubmit={onCommentSubmit}>
                <div className="py-2 px-4 mb-4 rounded-lg rounded-t-lg border bg-gray-800 border-gray-700">
                    <label htmlFor="comment" className="sr-only">Your comment</label>
                    <textarea id="comment" rows={6}
                        className="px-0 w-full text-sm border-0 focus:ring-0 focus:outline-none text-white placeholder-gray-400 bg-gray-800"
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
                <MediaComment key={index} user={comment.user} comment={comment.comment} date={comment.date} replies={comment.replies} />
            ))}
        </div>
    );
}