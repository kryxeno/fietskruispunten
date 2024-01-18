<script>
	import LeafletMap from '$lib/LeafletMap.svelte';
	import Introductie from '$lib/Introductie.svelte';
	import Navigation from '../lib/components/Navigation.svelte';

	let page = 2;
	let hasNavigation = false;

	const setPage = (newPage) => {
		page = newPage;
	};
</script>

<Navigation {setPage} {page} tabs={hasNavigation}/>
<main style="height: calc(100% - var(--nav-height) {hasNavigation ? '- var(--nav-menu-height)' : ''});">
	{#if page === 1}
		<Introductie />
	{:else if page === 2}
		<LeafletMap />
	{/if}
</main>

<style lang="scss">
	@import '$lib/globals.css';
	main {
		position: relative;
	}
</style>
