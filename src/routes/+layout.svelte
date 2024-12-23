<script>
	import './layout.sass';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	const flash = getFlash(page);
</script>
{#if $flash}
		<div class="flash-message {$flash.type}">
			{$flash.message}
		</div>
{/if}
<slot></slot>
<footer>
	<nav>
		<a href="/">Home</a>&nbsp;|&nbsp;
		<a href="/about">About</a>&nbsp;|&nbsp;
		<a href="/dashboard">Dashboard</a>
	</nav>
</footer>