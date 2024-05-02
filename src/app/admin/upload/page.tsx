'use client';
import Navbar from '@/app/components/navbar';
import InputField from "@/app/components/input_field";
import {FormEvent, useState} from "react";
import {uploadAnime} from "@/app/actions";

export default function AdminUpload() {
    const [title, setTitle] = useState('');
    const [episode, setEpisode] = useState('1');
    const [synopsis, setSynopsis] = useState('');
    const [rating, setRating] = useState('1');
    const [genres, setGenres] = useState('');
    const [imageUrl, setImageUrl] = useState('https://cdn.myanimelist.net/images/anime/1441/122795.jpg');
    const [file, setFile] = useState('');
    
    // Add another attribute that will store the video file with type File
    const [videoFile, setVideoFile] = useState<File | null>(null);

    /**
     * Validate the URL to ensure it is a valid image URL
     * @param url The URL to validate
     * @returns The URL if it is valid, otherwise an empty string
     * @todo Fix this function
     **/
    function validateUrl(url: string) {
        // Check if url doesn't start with http or https
        if (!url.startsWith('http://cdn') && !url.startsWith('https://cdn')) {
            return '';
        }
        const invalidChars = /[^a-zA-Z0-9\-._~:/?#@!$&'()*+,;=%]/g;
        if (url.match(invalidChars) === null) {
            return url;
        }
        return '';
    }

    async function onUpload(event : FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('episode', episode);
        formData.append('synopsis', synopsis);
        formData.append('rating', rating);
        formData.append('genres', genres);
        formData.append('imageUrl', imageUrl);
        formData.append('file', videoFile as Blob);
        const data = await uploadAnime(formData);

        if (data.status === 200) {
            alert('Anime uploaded successfully');
        } else {
            alert(data.message);
        }
    }
    return (
        <div
            className="h-screen bg-gradient-to-t from-black from-10% via-slate-800 via-40% to-sky-950 to-90% bg-scroll space-y-6">
            <Navbar isAdmin={true} onAdmin={true} onHome={false} onForums={false}/>
            <h1 className="text-3xl font-bold text-center text-white">Upload Anime</h1>
            <form onSubmit={onUpload} className="mx-auto max-w-screen-md rounded-lg bg-gray-950 px-5 py-8 shadow-lg md:px-10 ">
                <InputField label="Title" placeholder="Anime title" value={title} type="text" required={true}
                            onChange={(e) => setTitle(e.target.value)}/>
                <InputField label="Episode" placeholder="Episode number" value={episode} type="number" required={true}
                            min={1} max={99999} onChange={(e) => setEpisode(e.target.value)}/>
                <InputField label="Synopsis" placeholder="Synopsis" value={synopsis} type="text" required={true}
                            onChange={(e) => setSynopsis(e.target.value)}/>
                <InputField label="Rating" placeholder="Rating" value={rating} type="number" required={true}
                            min={1} max={10}
                            onChange={(e) => setRating(e.target.value)}/>
                <InputField label="Genres" placeholder="Comedy, Action, Romance" value={genres} type="text"
                            required={true}
                            onChange={(e) => setGenres(e.target.value)}/>
                <InputField label="Image URL from MyAnimeList.com"
                            placeholder="https://cdn.myanimelist.net/images/anime/1441/122795.jpg"
                            value={imageUrl} type="url"
                            required={true} onChange={(e) => {
                    const validUrl = validateUrl(e.target.value);
                    setImageUrl(validUrl);
                }}
                />
                {/*<Image src={imageUrl} alt="Anime Image" width={200} height={300}/>*/}
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
