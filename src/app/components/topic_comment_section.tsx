'use client';
import React from 'react';

export function TopicCommentSection() {
    const [comments, setComments] = React.useState<{ id: number; text: string; timestamp: string; }[]>([]);
    const [commentInput, setCommentInput] = React.useState('');

    const handleCommentSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault(); 
        const newComment = {
            id: comments.length + 1,
            text: commentInput,
            timestamp: new Date().toISOString()
        };
        setComments([...comments, newComment]); 
        setCommentInput(''); 
    };

    return (
        <div className="bg-white dark:bg-gray-900 py-8 px-6 antialiased">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Comments ({comments.length})
                </h2>
            </div>
            <form className="mb-6" onSubmit={handleCommentSubmit}>
                <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="comment" className="sr-only">Your comment</label>
                    <textarea id="comment" rows={6}
                        className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Write a comment..." required
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-400 rounded-lg">
                    Post comment
                </button>
            </form>
            {comments.map(comment => (
                <div key={comment.id} className="py-2 px-4 my-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-800 dark:text-gray-300">{comment.text}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
