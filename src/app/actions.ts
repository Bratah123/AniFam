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

export async function sendRegistrationRequest(username: string, password: string) {
    let rawResult: Response;
    let result;
    let form = new FormData();
    const jwt = cookies().get('access_token');
    form.append('username', username);
    form.append('password', password);
    // Send registration request to server
    try {
        rawResult = await fetch('http://127.0.0.1:5328/register', {
            method: 'POST',
            body: form,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
        });
        result = await rawResult.json();
    } catch (error) {
        console.log(error);
    }
    return result;
}

export async function sendDeleteUserRequest(username: string) {
    const jwt = cookies().get('access_token');
    let rawResult: Response;
    let result;
    let form = new FormData();
    form.append('username', username);
    // Send registration request to server
    try {
        rawResult = await fetch('http://127.0.0.1:5328/user', {
            method: 'DELETE',
            body: form,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
        });
        result = await rawResult.json();
    } catch (error) {
        console.log(error);
    }
    return result;
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

    if (result.status === 401 || result.status === 422) {
        console.log('User is not authenticated');
        redirect('/');
    }

    return await result.json();
}

export async function fetchUsers() {
    const jwt = cookies().get('access_token');
    let result: Response;
    try {
      result = await fetch('http://127.0.0.1:5328/users', {
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
    if (result.status === 200) {
      // User is authenticated
    }
  
    if (result.status === 401 || result.status === 422) {
      console.log('User is not authenticated');
      redirect('/');
    }
    return result.json();
  }

export async function uploadAnime(data: FormData) {
  const jwt = cookies().get('access_token');
  let result: Response;
  try {
      result = await fetch('http://127.0.0.1:5328/admin/upload', {
          method: 'POST',
          body: data,
          cache: 'no-cache',
          credentials: 'include',
          headers: {
              Authorization: `Bearer ${jwt?.value}`,
          },
      });
      return await result.json();
  } catch (error) {
      console.log(error);
      return error;
  }
}

export async function uploadAnimeEpisode(data: FormData) {
    const jwt = cookies().get('access_token');
    let result: Response;
    try {
        result = await fetch('http://127.0.0.1:5328/admin/upload_episode', {
            method: 'POST',
            body: data,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
                });
                return await result.json();
            } catch (error) {
                console.log(error);
                return error;
            }
        }

export async function deleteAnimeEpisode(data: FormData) {
    const jwt = cookies().get('access_token');
    let result: Response;
    try {
        result = await fetch('http://127.0.0.1:5328/admin/delete', {
            method: 'DELETE',
            body: data,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
        });
        return await result.json();
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function uploadForumTopic(title: string, long_description: string, short_description: string, user: string) {
    const jwt = cookies().get('access_token');
    let result: Response;
    let form = new FormData();
    form.append('title', title);
    form.append('long_description', long_description);
    form.append('short_description', short_description);
    form.append('user', user);
    try {
        result = await fetch('http://127.0.0.1:5328/forums/upload', {
            method: 'POST',
            body: form,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
        });
        return await result.json();
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function uploadComment(animeName: string, animeEpisode: string, comment: string) {
    const jwt = cookies().get('access_token');
    let result: Response;
    let form = new FormData();
    form.append('animeName', animeName);
    form.append('animeEpisode', animeEpisode);
    form.append('comment', comment);
    try {
        result = await fetch('http://127.0.0.1:5328/comment/upload', {
            method: 'POST',
            body: form,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
        });
        return await result.json();
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export async function uploadTopicComment(title: string, comment: string) {
    const jwt = cookies().get('access_token');
    let result: Response;
    let form = new FormData();
    form.append('title', title);
    form.append('comment', comment);
    try {
        result = await fetch('http://127.0.0.1:5328/topic_comment/upload', {
            method: 'POST',
            body: form,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
        });
        return await result.json();
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export async function deleteTopicComment(commentId: string) {
    const jwt = cookies().get('access_token');
    let result: Response;
    let formData = new FormData();
    formData.append('comment_id', commentId);
    try {
        result = await fetch('http://127.0.0.1:5328/topic_comments/delete', {
            method: 'DELETE',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
        });
        return await result.json();
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export async function sendEditUserRequest(username: string, password: string, isAdmin: boolean) {
    const jwt = cookies().get('access_token');
    let rawResult: Response;
    let result;
    let form = new FormData();
    form.append('username', username);
    form.append('password', password);
    form.append('is_admin', isAdmin.toString());

    try {
        rawResult = await fetch('http://127.0.0.1:5328/user', {
            method: 'PUT',
            body: form,
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${jwt?.value}`,
            },
        });
        result = await rawResult.json();
    } catch (error) {
        console.log(error);
    }
    return result;
}