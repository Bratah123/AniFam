'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { deleteForumTopic } from "@/app/actions";

type ButtonProp = {
    text: string;
    topicTitle: string;  // We're expecting the title of the topic to delete
};

export default function DeleteLinkButton({ text, topicTitle }: ButtonProp) {
    const router = useRouter();

    const handleDelete = async () => {
        const formData = new FormData();
        formData.append('title', topicTitle);  // Append the title to FormData as expected by the backend

        const result = await deleteForumTopic(formData);
        if (result.status === 200) {
            alert('Topic deleted successfully');
            router.push('/forums'); // Redirect or refresh as needed
        } else {
            alert(`Failed to delete topic: ${result.message}`);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 1000
        }}>
            <button
                onClick={handleDelete}  // Use handleDelete on click
                className="rounded bg-indigo-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out
                           hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2">
                {text}
            </button>
        </div>
    );
}


