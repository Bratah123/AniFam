'use server';
/**
 * This file contains the actions/functions that directly communicate with the flask server.
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function sendLoginRequest(data: FormData) {
    let rawResult: Response;
    let result;

    // Send login request to server
    try {
        rawResult = await fetch('http://127.0.0.1:5328/login/request', {
        method: 'POST',
        body: data,
        cache: 'no-cache',
        credentials: 'include', // I don't know if we need all this with JWT
        });
        result = await rawResult.json();
    } catch (error) {
        console.log(error);
        return {
        message: 'An unknown error has occurred',
        };
    }

    // Check status code
    if (result.status === 200) {
        // Store access token in cookie
        const cookieStore = cookies();
        cookieStore.set('access_token', result.access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        // Redirect to home page
        console.log('Login successful');
        return {
        message: 'Success',
        is_admin: result.is_admin,
        };
    }

    if (result.status === 401) {
        // Notify the user by mutating the form
        console.log('Login failed');
        return {
        message: result.message,
        };
    }

    if (result.status === 500) {
        console.log('Internal server error');
        return {
        message: 'Internal server error',
        };
    }
}

// Requests the flask server to check any active JWT session and return the user's data
export async function fetchAnyAvailSession(
    apiPath: string,
    args?: { [key: string]: string },
  ) {
    const jwt = cookies().get('access_token');
    let result: Response;
    // Create args string
    let argsString = '';
    if (args) {
        argsString = '?';
        for (const arg in args) {
        argsString += `${arg}=${args[arg]}&`;
        }
        argsString = argsString.slice(0, -1);
    } else {
        argsString = '';
    }
    let fetchUrl = `http://127.0.0.1:5328/${apiPath}`;
    if (argsString) {
        fetchUrl += argsString;
    }
    try {
        result = await fetch(fetchUrl, {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${jwt?.value}`,
        },
        });
    } catch (error) {
        console.log(error);
        return;
    }

    // if (result.status === 200) {
    //     // User is authenticated
    // }

    if (result.status === 401 || result.status === 422) {
        console.log('User is not authenticated');
        redirect('/');
    }

    return await result.json();
}