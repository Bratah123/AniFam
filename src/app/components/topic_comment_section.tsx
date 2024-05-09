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
        setLocalComments(comments as TopicCommentProps[]); // Update local comments when props change
    }, [comments]);

    function handleReply(commentId: number) {
        console.log("not implemented yet:", commentId);
    }

    function handleEdit(commentId: number) {
        console.log("not implemented yet:", commentId);
    }

    async function handleDelete(commentId: number) {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                const response = await deleteTopicComment(commentId.toString());
                if (response.status === 200) {
                    const updatedComments = localComments.filter(comment => comment.commentId !== commentId);
                    setLocalComments(updatedComments);

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
            // If the response is successful and includes a commentId, update local state
            const newCommentData = {
                user: user,
                comment: newComment,
                date: new Date().toISOString(),
                replies: [],
                commentId: res.commentId || 0, 
                onReply: () => {},
                onEdit: () => {},
                onDelete: () => handleDelete(res.commentId || 0) 
            };

            // Add the new comment to local state
            setLocalComments([newCommentData, ...localComments]);
            setNewComment('');  
        } else {
            // If there was a problem (e.g., the status code is not 200 or no commentId), alert the user
            alert('Failed to post comment: ' + res.message); 
        }
    }
    
    return (
        <div>
            <form onSubmit={onCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a new comment..."
                    rows={3}
                    style={{ width: '100%', color: 'black'}}
                />
                <button type="submit">Post Comment</button>
            </form>
            {localComments.map((comment) => (
    <TopicComment key={comment.commentId} {...comment} onDelete={() => handleDelete(comment.commentId)} />
))}
        </div>
    );
}
