<script>
	import './index.sass';
	import {Model} from '$lib/ghmodels.js';
	export let data;
</script>
<main>
	<div class="hero">
		<h1 class="w3-container w3-jumbo">
			Github Models chat!
		</h1>
		{#if data.logged_in}
			<a href="/dashboard" class="w3-button w3-blue w3-topright">dashboard</a>
		{/if}
		<p>Just a little svelte website for gh models.</p>
		<p class="login-buttons">
			<a href="/signin">signin</a>
			<a href="/signup">signup</a>
		</p>
	</div>
	<p class="details">
		Interact with your github models bots in this friendly interface.
	</p>
	<div class="posters-container">
		{#each Model.all() as model}
			<div class="poster">
				<img src={model.image_path()} width="100" height="100" />
				<p>{model.name}</p>
			</div>
		{/each}
	</div>
	<p>
		<em>
			This project is still in active development.
			<br />
			Please report issues at
			<a href="https://github.com/ken-morel/svghai/issues/new">
				our bugtracker
			</a>
			.
		</em>
	</p>
</main>
