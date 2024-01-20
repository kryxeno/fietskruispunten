<script>
	import stoplicht from '$lib/image-components/stoplicht.svelte';
	import fietsweg from '$lib/image-components/fietsweg.svelte';
	import kruispunt from '$lib/image-components/kruispunt.svelte';
	import startpunt from '$lib/image-components/startpunt.svelte';
	import eindpunt from '$lib/image-components/eindpunt.svelte';
	import werkzaamheden from '$lib/image-components/werkzaamheden.svelte';

	export let type = 'stoplicht';
	export let scale = 1;
	export let small = null;
	export let stroke;
	export let fill;

	const icons = {
		stoplicht,
		fietsweg,
		kruispunt,
		werkzaamheden,
		startpunt,
		eindpunt
	};
</script>

<svelte:component
	this={icons[type]}
	style="scale: {scale}; width: {small ? '1.75rem' : '2.5rem'}; height: {small
		? '1.75rem'
		: '2.5rem'}; transition: scale 0.2s ease-in-out; flex-shrink: 0;"
	{stroke}
	{fill}
/>
