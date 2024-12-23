<script>
	import './new.sass';
	export let data;
</script>
<main>
	<h3>Choose a model</h3>
	<div class="models">
		{#each data.models as model}
			<div class="model">
				<img src={model.image} />
				<p>{model.name}</p>
			</div>
		{/each}
	</div>
</main>
