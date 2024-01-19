<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let geocoderElement = null;

	onMount(() => {
		if (browser && geocoderElement) {
			document.querySelector('.geocoder').prepend(geocoderElement);
			document.querySelectorAll('.leaflet-routing-geocoder').forEach((node) => {
				node.childNodes[0].disabled = false;
			});
		}
	});
</script>

<div class="geocoder">
	{#if !geocoderElement}
		<input type="text" placeholder="Loading..." class="temp" />
		<input type="text" placeholder="Loading..." class="temp" />
	{/if}
	<input type="datetime-local" id="datePicker" value={new Date().toISOString().slice(0, 16)} />
</div>

<style lang="scss">
	@import '$lib/leaflet-style.css';

	.geocoder {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;

		input {
			border: 1px solid var(--color-grey);
			padding: 0.5rem 1rem;
		}
	}
</style>
