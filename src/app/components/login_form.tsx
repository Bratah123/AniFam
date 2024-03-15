'use client';
import { useState } from 'react';
import { redirect } from 'next/navigation';

export default function Login() {
  const [message, setMessage] = useState<string>(''); // Init as empty

  async function onLogin(data: FormData) {
    // TODO: Add login logic
  }

  if (message === 'Login successful') {
    redirect('/home');
  }

  return (
    <div className="flex items-center justify-center">
      <div className="mix-blend-color-screen -mt-20 rounded-xl bg-cyan-100/90 p-5 drop-shadow-2xl sm:w-1/3 xl:w-1/6">
        <form
          id="loginForm"
          /*action={onLogin}*/
          className="flex flex-col items-center gap-2"
        >
          <label className="text-2xl font-bold text-black">Login</label>
          <input
            placeholder="Username"
            className="mt-2 h-8 w-full rounded p-2 text-black"
            type="text"
            name="username"
            autoComplete="username"
          />
          <input
            placeholder="Password"
            className="h-8 w-full rounded p-2 text-black"
            type="password"
            name="password"
          />
          <span className="mb-4 text-sm text-red-500 xl:text-base">
            {message}
          </span>
          <button
            className="w-full rounded bg-slate-500 p-2 text-slate-100 outline-none hover:bg-slate-400 active:bg-slate-500"
            type="submit"
          >
            Login
          </button>
          <p className="mt-4 text-center text-xs italic text-zinc-600 xl:text-sm">
            Don&apos;t have an account?<br></br>
            Contact the administrator to register
          </p>
        </form>
      </div>
    </div>
  );
}
