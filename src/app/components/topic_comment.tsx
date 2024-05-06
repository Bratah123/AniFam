'use client';
import Image from 'next/image';


export interface TopicCommentProps {
    user: string;
    comment: string;
    date: string;
    replies: string[];
}

export function TopicComment(comment: TopicCommentProps) {

    
    return (
        <div>
            <footer className="flex justify-between items-center mb-2 my-10">
                <div className="flex items-center">
                    <p className="inline-flex items-center text-sm text-gray-900 dark:text-white font-semibold"/>
                        <Image
                            className="mr-2 w-6 h-6 rounded-full"
                            src="/anya_chibi_happy.jpg"
                            alt="anya pfp"
                            width={150}
                            height={150}/>
                    <p className='px-2'>{comment.user}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400"><time
                            title="February 8th, 2022">{comment.date}</time></p>
                </div>
            </footer>
            <p className="text-gray-500 dark:text-gray-400">{comment.comment}</p>
            <div className="flex items-center mt-4 space-x-4">
                <button type="button"
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                    </svg>
                    Reply
                </button>
                <button type="button"
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <Image src="/pencil_icon.png" alt="pencil icon" width={20} height={20} />
                    Edit
                </button>
                <button type="button"
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <Image src="/trash_can_icon.webp" alt="trash can icon" width={20} height={20} />
                    Delete
                </button>
            </div>
        </div>
    );
}