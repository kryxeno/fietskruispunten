<script>
	import startpunt from '$lib/images/startpunt.svg';
	import eindpunt from '$lib/images/eindpunt.svg';

	export let type = 'stoplicht';
	export let afstand = 0;

	const icons = {
		start: startpunt,
		eind: eindpunt
	};
</script>

<div style="left: {afstand}%;">
	<img src={icons[type]} alt="" style={type === 'eind' && 'translate: -100% 0;'} />
</div>

<style lang="scss">
	div {
		position: absolute;
		width: 1.75rem;
		aspect-ratio: 1;
	}
</style>
