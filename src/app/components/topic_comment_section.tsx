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
                    alert('Comment deleted successfully');
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
        const res = await uploadTopicComment(topic_title, newComment); 
        if (res.status === 200) {
            const newCommentData = {
                user: user,
                comment: newComment,
                date: new Date().toISOString(),
                replies: [],
                commentId: Date.now(), // Generate a unique ID based on timestamp
                onReply: () => {},
                onEdit: () => {},
                onDelete: () => handleDelete(Date.now()) // Handle delete for newly added comment
            };
            // Add the new comment to local state
            setLocalComments([newCommentData, ...localComments]);
            setNewComment(''); 
        } else {
            alert(res.message); 
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
            {localComments.map((comment, index) => (
                <TopicComment key={index} {...comment} onDelete={() => handleDelete(comment.commentId)} />
            ))}
        </div>
    );
}
