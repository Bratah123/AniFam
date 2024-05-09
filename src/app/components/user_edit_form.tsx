'use client';
import {useState} from 'react';
import { sendEditUserRequest } from "@/app/actions";

type UserProps = {
    username: string;
    email: string;
    password: string;
    is_admin: boolean;
};

export default function UserEditForm(prop: {
    user: UserProps;
    onClose: () => void;
}) {
    const name = prop.user.username;
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(prop.user.is_admin);

    const handleSave = () => {
        sendEditUserRequest(name, password, isAdmin).then((res) => {
                if (res.status === 200) {
                    prop.onClose();
                } else {
                    alert(res.message);
                }
            }
        );
    };

    return (
        <>
            <div className="relative max-w-screen-md rounded-lg bg-gray-950 px-5 py-8 shadow-lg md:px-10">
                <h4 className="mb-4 text-lg font-bold">User Info</h4>
                <label className="text-sm font-bold leading-tight tracking-normal">
                    Name
                </label>
                <input
                    id="name"
                    className="bg-gray-600 mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal focus:border focus:border-indigo-700 focus:outline-none"
                    placeholder="Name"
                    value={name}
                    readOnly
                />
                <label className="text-sm font-bold leading-tight tracking-normal">
                    Password
                </label>
                <div className="relative mb-5 mt-2">
                    <input
                        id="password"
                        className="mb-5 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-indigo-700 focus:outline-none"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <label className="text-sm font-bold leading-tight tracking-normal">
                    Role
                </label>
                <div className="relative mb-5 mt-2">
                    <select
                        id="role"
                        className="mb-8 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-indigo-700 focus:outline-none"
                        value={isAdmin ? 'admin' : 'user'}
                        onChange={(e) => {
                            setIsAdmin(e.target.value === 'admin');
                        }}
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div className="flex w-full items-center justify-start">
                    <button
                        onClick={() => {
                            handleSave();
                        }}
                        className="rounded bg-indigo-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
                    >
                        Save
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
        </>
    );
}
