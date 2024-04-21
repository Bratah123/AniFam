'use client';
import {useState} from 'react';
import {sendRegistrationRequest} from "@/app/actions";

export default function RegistrationForm(prop: { onClose: () => void, onSave: (username: string) => void}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const registerUser = async () => {
        if (username === '' || password === '') {
            alert('Please fill in all fields');
            return;
        }
        await sendRegistrationRequest(username, password).then((res) => {
            if (res.status === 200) {
                alert('User created successfully');
                // Add user to the list of users
                prop.onSave(username);
                prop.onClose();
            } else {
                alert(res.message);
            }
        });
    }
    return (
        <div className="relative max-w-screen-md rounded-lg bg-gray-950 px-5 py-8 shadow-lg md:px-10">
            <h4 className="mb-4 text-lg font-bold">Registration Form</h4>
            <label className="text-sm font-bold leading-tight tracking-normal">
                Username
            </label>
            <input
                id="username"
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-indigo-700 focus:outline-none"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <label className="text-sm font-bold leading-tight tracking-normal">
                Password
            </label>
            <input
                id="password"
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-indigo-700 focus:outline-none"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex w-full items-center justify-start">
                <button
                    onClick={() => {
                        registerUser();
                    }}
                    className="rounded bg-indigo-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
                >
                    Create User
                </button>
                <button
                    className="ml-3 rounded border  bg-gray-100 px-8 py-2 text-sm text-gray-600 transition duration-150 ease-in-out hover:border-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    onClick={() => {
                        prop.onClose();
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}