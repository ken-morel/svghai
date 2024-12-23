<script>
	import './dashboard.sass';
	export let data;
</script>
<main>
	<div class="hero">
		<h3>Hy {data.username || "You"}&#128075;</h3>
	</div>
	<div class="chats">
		<div class="chat-list">
			{#each data.chats as chat}
				<div class="chat-view">
				</div>
			{/each}
		</div>
		<a class="new" href="/chats/new">+</a>
	</div>
</main>