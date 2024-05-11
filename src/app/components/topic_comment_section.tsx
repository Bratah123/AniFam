'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { TopicComment, TopicCommentProps, BasicTopicCommentProps } from '@/app/components/topic_comment';
import { uploadTopicComment } from '@/app/actions'; 
import { deleteTopicComment } from '@/app/actions';

interface TopicCommentSectionProps {
    comments: BasicTopicCommentProps[];
    user: string;
    topic_title: string;
}

export interface TopicCommentResponse {
    status: number;
    message: string;
    commentId?: number; 
}

export function TopicCommentSection({ comments, user, topic_title }: TopicCommentSectionProps) {
    const [localComments, setLocalComments] = useState<TopicCommentProps[]>(comments as TopicCommentProps[]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setLocalComments(comments as TopicCommentProps[]); 
    }, [comments]);

    async function handleDelete(commentId: number) {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                const response = await deleteTopicComment(commentId.toString()); 
                if (response.status === 200) {
                    setLocalComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
                } else {
                    alert('Failed to delete comment: ' + response.message);
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Error deleting comment');
            }
        }
    }

    async function onCommentSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!newComment.trim()) {
            alert("Please enter a non-empty comment.");
            return;
        }

        const res = await uploadTopicComment(topic_title, newComment) as TopicCommentResponse;

        if (res.status === 200 && res.commentId) {
            const newCommentData = {
                user: user,
                comment: newComment,
                date: new Date().toISOString(),
                commentId: res.commentId || 0, 
                onDelete: () => handleDelete(res.commentId || 0) 
            };

            setLocalComments([newCommentData, ...localComments]);
            setNewComment('');  
        } else {
            alert('Failed to post comment: ' + res.message); 
        }
    }
    
    return (
        <div className="bg-gray-900 py-8 px-6 antialiased min-h-screen">
            <form onSubmit={onCommentSubmit} className="mb-6">
                <div className="py-2 px-4 mb-4 rounded-lg rounded-t-lg border bg-gray-800 border-gray-700">
                    <label htmlFor="newComment" className="sr-only">Your comment</label>
                    <textarea
                        id="newComment"
                        rows={3}
                        className="px-0 w-full text-sm border-0 focus:ring-0 focus:outline-none text-white placeholder-gray-400 bg-gray-800"
                        placeholder="Write a new comment..."
                        required
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </div>
                <button
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-400 rounded-lg">
                    Post Comment
                </button>
            </form>
            {localComments.map((comment) => (
                <TopicComment key={comment.commentId} {...comment} onDelete={() => handleDelete(comment.commentId)} />
            ))}
        </div>
    );
}

