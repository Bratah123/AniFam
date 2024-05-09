'use client';
import Image from 'next/image';

export interface BasicTopicCommentProps {
    user: string;
    comment: string;
    date: string;
    replies: BasicTopicCommentProps[];
    commentId: number;
}

export interface TopicCommentProps extends BasicTopicCommentProps {
    onReply: (commentId: number) => void;
    onEdit: (commentId: number) => void;
    onDelete: (commentId: number) => void;
}

export function TopicComment(props: TopicCommentProps) {
    return (
        <div className='bg-gray-900'>
            <footer className="flex justify-between items-center mb-2 my-10">
                <div className="flex items-center">
                    <Image
                        className="mr-2 w-6 h-6 rounded-full"
                        src="/anya_chibi_happy.jpg"
                        alt="anya pfp"
                        width={24}
                        height={24}/>
                    <p className='px-2'>{props.user}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <time title={props.date}>{props.date}</time>
                    </p>
                </div>
            </footer>
            <p className="text-gray-500 dark:text-gray-400">{props.comment}</p>
            <div className="flex items-center mt-4 space-x-4">
                <button type="button" onClick={() => props.onReply(props.commentId)}
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h14m-9 3h9m-14 4h14m2-9H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4v-5h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3z"/>
                    </svg>
                    Reply
                </button>
                <button type="button" onClick={() => props.onEdit(props.commentId)}
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <Image src="/pencil_icon.png" alt="pencil icon" width={20} height={20} />
                    Edit
                </button>
                <button type="button" onClick={() => props.onDelete(props.commentId)}
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <Image src="/trash_can_icon.webp" alt="trash can icon" width={20} height={20} />
                    Delete
                </button>
            </div>
        </div>
    );
}