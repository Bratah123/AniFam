'use client';
import Navbar from '@/app/components/navbar';
import InputField from "@/app/components/input_field";
import {FormEvent, useState} from "react";
import {deleteAnimeEpisode} from "@/app/actions";

export default function AdminDelete() {
    const [title, setTitle] = useState('');
    const [episode, setEpisode] = useState('1');

    const [focusedDescription, setFocusedDescription] = useState('');

    async function onDelete(event : FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('episode', episode);
        const data = await deleteAnimeEpisode(formData);

        if (data.status === 200) {
            alert(`Successfully deleted episode ${episode} from ${title}`);
        } else {
            alert(data.message);
        }
    }

    function onTitleFocus() {
        setFocusedDescription('Title: provide the name of an anime that currently exists in the Ani x Family database (Non-case sensitive).');
    }

    function onEpisodeFocus() {
        setFocusedDescription('Episode: provide the episode number of the anime episode you are deleting.');
    }

    return (
        <div
            className="h-screen bg-gradient-to-t from-black from-10% via-slate-800 via-40% to-sky-950 to-90% bg-scroll space-y-6">
            <Navbar isAdmin={true} onAdmin={true} onHome={false} onForums={false}/>
            <h1 className="text-3xl font-bold text-center text-white">Delete An Anime Episode</h1>
            <form onSubmit={onDelete} className="mx-auto max-w-screen-md rounded-lg bg-gray-950 px-5 py-8 shadow-lg md:px-10 ">
            <div className='flex'>
                    <div className='flex flex-col'>
                        <InputField label="Title" placeholder="Anime title" value={title} type="text" required={true} onFocus={onTitleFocus}
                                    onChange={(e) => setTitle(e.target.value)}/>
                        <br></br>
                        <InputField label="Episode" placeholder="Episode number" value={episode} type="number" required={true} onFocus={onEpisodeFocus}
                                    min={1} max={99999} onChange={(e) => setEpisode(e.target.value)}/>
                        <button
                            className="my-8 rounded bg-indigo-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2">
                            Delete
                        </button>
                    </div>
                    <h1 className='text-2xl text-center text-white'>{focusedDescription}</h1>
                </div>
            </form>
        </div>
    );
}
