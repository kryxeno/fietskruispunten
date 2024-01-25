<script>
	import { route, expert } from '$lib/stores';
	import { onMount } from 'svelte';
	export let geocoderElement = null;

	let showGeocoder = false;

	const renderGeocoder = () => {
		showGeocoder = true;
		const container = document.querySelector('.geocoder');
		if (container) {
			container.prepend(geocoderElement);
			document
				.querySelectorAll('.leaflet-routing-geocoder')
				.forEach((el) => el.firstChild && (el.firstChild.disabled = false));
		}
	};

	$: {
		if (geocoderElement && $route && !$expert) renderGeocoder();
	}

	onMount(() => {
		if (geocoderElement && $route && !$expert) renderGeocoder();
	});
</script>

<div class="geocoder">
	{#if !geocoderElement || !showGeocoder}
		<div>
			<input type="text" placeholder="Loading..." class="temp" />
			<input type="text" placeholder="Loading..." class="temp" />
		</div>
	{/if}
	<input type="datetime-local" id="datePicker" value={new Date().toISOString().slice(0, 16)} />
</div>

<style lang="scss">
	.geocoder {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;

		input {
			border: 1px solid var(--color-grey);
			padding: 0.5rem 1rem;
		}

		> div {
			display: flex;
			flex-direction: column;
			gap: 0.6rem;

			input {
				display: none;

				&:first-of-type,
				&:last-of-type {
					display: block;
				}
			}
		}

		:global(.leaflet-routing-geocoder) {
			display: none;

			&:first-of-type,
			&:last-of-type {
				display: block;
			}
		}
	}
</style>
