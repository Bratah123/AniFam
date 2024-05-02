'use client';
import Navbar from '@/app/components/navbar';
import InputField from "@/app/components/input_field";
import {FormEvent, useState} from "react";
import {uploadAnime, uploadAnimeEpisode} from "@/app/actions";

export default function AdminUploadEpisode() {
    const [title, setTitle] = useState('');
    const [episode, setEpisode] = useState('1');
    const [file, setFile] = useState('');
    
    // Add another attribute that will store the video file with type File
    const [videoFile, setVideoFile] = useState<File | null>(null);

    async function onUpload(event : FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('episode', episode);
        formData.append('file', videoFile as Blob);
        const data = await uploadAnimeEpisode(formData);

        if (data.status === 200) {
            alert(`Anime Episode ${episode} successfully uploaded.`);
        } else {
            alert(data.message);
        }
    }
    return (
        <div
            className="h-screen bg-gradient-to-t from-black from-10% via-slate-800 via-40% to-sky-950 to-90% bg-scroll space-y-6">
            <Navbar isAdmin={true} onAdmin={true} onHome={false} onForums={false}/>
            <h1 className="text-3xl font-bold text-center text-white">Upload Anime Episode (To Existing Animes)</h1>
            <form onSubmit={onUpload} className="mx-auto max-w-screen-md rounded-lg bg-gray-950 px-5 py-8 shadow-lg md:px-10 ">
                <InputField label="Title" placeholder="Anime title" value={title} type="text" required={true}
                            onChange={(e) => setTitle(e.target.value)}/>
                <br></br>
                <InputField label="Episode" placeholder="Episode number" value={episode} type="number" required={true}
                            min={1} max={99999} onChange={(e) => setEpisode(e.target.value)}/>
                <br></br>
                <InputField label="Video File (spy.mp4)" placeholder="Upload Video" value={file} type="file" required={true} accept="video/mp4"
                            onChange={
                                (e) => {
                                    setFile(e.target.value)
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setVideoFile(file);
                                    }
                                }}/>
                <button
                    className="my-8 rounded bg-indigo-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2">
                    Upload
                </button>
            </form>
        </div>
    );
}
