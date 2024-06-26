'use client';
import Navbar from '@/app/components/navbar';
import InputField from "@/app/components/input_field";
import { FormEvent, useState, useEffect } from "react";
import { fetchAnyAvailSession, uploadForumTopic } from "@/app/actions";

export default function ForumsUploadPage() {
    const [title, setTitle] = useState('');
    const [long_description, setLongDescription] = useState('');
    const [short_description, setShortDescription] = useState('');
    const [focusedDescription, setFocusedDescription] = useState('');
    const [res, setRes] = useState({ is_admin: false, logged_in_as: '' });

    useEffect(() => {
        const getSessionInfo = async () => {
            const sessionInfo = await fetchAnyAvailSession('user');
            if (sessionInfo === 'admin') {
                setRes({ is_admin: true, logged_in_as: 'admin' });
            } else {
                setRes({ is_admin: false, logged_in_as: sessionInfo });
            }
        };
        getSessionInfo();
    }, []);


    async function onUpload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('long_description', long_description);
        formData.append('short_description', short_description);
        formData.append('user', res.logged_in_as);

        const data = await uploadForumTopic(title, long_description, short_description, res.logged_in_as);

        if (data.status === 200) {
            alert('Topic uploaded successfully');
        } else {
            alert(data.message);
        }
    }

    function onTitleFocus() {
        setFocusedDescription('Title: provide the name of the discussion topic!');
    }

    function onLongDescFocus() {
        setFocusedDescription('Long Description: This will show on your topic page!');
    }

    function onShortDescFocus() {
        setFocusedDescription('Short Description: This will show on your topic card on the forums page!');
    }

    return (
        <div className="flex flex-col h-screen relative bg-slate-1000 bg-[url(/album_collage_1080.jpg)] bg-cover bg-center bg-no-repeat opacity-85">
            <Navbar isAdmin={res.is_admin} onAdmin={false} onHome={false} onForums={true}/>
            <h1 className="text-3xl font-bold text-center text-white">Upload Topic</h1>
            <form onSubmit={onUpload} className="mx-auto h-full w-full max-w-screen-lg rounded-lg bg-gray-950 px-8 py-10 shadow-lg md:px-12 relative">
            <InputField label="Title" placeholder="Topic title" value={title} type="text" required={true} maxLength={50}
                onChange={(e) => setTitle(e.target.value)} onFocus={onTitleFocus} />
<           InputField label="Long Description" placeholder="Long description" value={long_description} type="textarea" required={true} rows={6} maxLength={500}
                onChange={(e) => setLongDescription(e.target.value)} onFocus={onLongDescFocus}/>
            <InputField label="Short Description" placeholder="Short description" value={short_description} type="textarea" required={true} rows={3} maxLength={150}
                onChange={(e) => setShortDescription(e.target.value)} onFocus={onShortDescFocus}/>

                <button
                    style={{ position: 'absolute', bottom: 10, left: 0, width: '100%' }}  
                    className="mt-8 mb-4 rounded bg-indigo-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2">
                    Upload
                </button>
                <div>
                <h1 className='text-2xl text-center text-white'>{focusedDescription}</h1>
                </div>
            </form>
        </div>
    );
}
