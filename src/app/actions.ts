'use server';

import { cookies } from 'next/headers';

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