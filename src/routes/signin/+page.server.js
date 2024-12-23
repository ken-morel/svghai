import { fail } from '@sveltejs/kit';
import { User } from '$lib/users.js';
import { redirect } from 'sveltekit-flash-message/server';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const
			username = formData.get('username'),
			password = formData.get('password');
		try {
			var user = await User.from_signin(username, password);
		} catch(e) {
			redirect('/signin', { type: 'error', message: "Invalid username or password." }, cookies);
		}
		
		cookies.set("username", user.username, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
		});
		cookies.set("gh_token", user.gh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
		});
		redirect('/dashboard', { type: 'success', message: "Signin successful." }, cookies);
	},
};