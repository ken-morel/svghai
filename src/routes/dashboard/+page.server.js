import { redirect } from 'sveltekit-flash-message/server';

export async function load({ cookies }) {
    const
        username = cookies.get('username'),
        gh_token = cookies.get('gh_token');
    // You can also handle cases where the cookie might not exist
    if (!gh_token || !username) {
        redirect(
            '/signin',
            {
                type: 'error',
                message: "Session cookies not found.",
            },
            cookies,
        );
    }
    return {
        username, // Return the cookie value to the page
        chats: [],
    };
}