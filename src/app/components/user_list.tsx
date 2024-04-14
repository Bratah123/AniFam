'use client';
/*
* This client component is used to display a list of registered users.
* ONLY TO BE USED IN THE ADMIN PANEL.
*/
import { FaEdit } from 'react-icons/fa';
import UserEditForm from '@/app/components/user_edit_form';
import { useEffect, useState } from 'react';
import { fetchUsers } from '@/app/actions';

export function getRole(isAdmin: boolean) {
  return isAdmin ? 'Admin' : 'User';
}

type UserProps = {
  username: string;
  email: string;
  password: string;
  is_admin: boolean;
};

export default function UserList() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [userToEdit, setUserToEdit] = useState('');
  const [createUser, setCreateUser] = useState(false);

  const getUsers = async () => {
    const res = await fetchUsers();
    setUsers(res.users);
  };

  useEffect(() => {
    getUsers();
  }, []);
  const handleClose = () => {
    setUserToEdit('');
    setCreateUser(false);
  };
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-8">
      <div className="flex items-center justify-between pb-7">
        <div>
          <h2 className="font-semibold">User Accounts</h2>
          <span className="text-xs">View accounts of registered users</span>
        </div>
        <button
          onClick={() => setCreateUser(true)}
          className="rounded bg-indigo-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
        >
          Create User
        </button>
      </div>
      <div className="overflow-y-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-950 text-left font-semibold uppercase tracking-widest text-white">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-50">
              {users.map((user) => (
                <tr
                  className="odd:bg-gray-700 even:bg-gray-500 hover:bg-gray-900"
                  key={user.username}
                >
                  <td className="px-5 py-5">
                    <p className="whitespace-no-wrap">{user.username}</p>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center">
                      <p className="whitespace-no-wrap">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-5 ">
                    <p className="whitespace-no-wrap">
                      {getRole(user.is_admin)}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <button
                      onClick={() => setUserToEdit(user.username)}
                      className="hover:text-black"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {userToEdit !== '' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleClose} // Close the modal when clicking on the overlay
          ></div>
          <div className="relative z-50">
            <UserEditForm
              user={users.find((user) => user.username === userToEdit)!}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
