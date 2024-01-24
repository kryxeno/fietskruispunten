<script>
	export let drukte = 0;

	const kleuren = {
		0: '#6BF719',
		1: '#FFD725',
		2: '#FF624E'
	};
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 16 21" fill="none">
	<rect x="6" y="7" width="4" height="14" fill={kleuren[drukte]} />
	<rect y="14" width="4" height="7" fill={drukte > 0 ? kleuren[drukte] : 'var(--color-grey)'} />
	<rect x="12" width="4" height="21" fill={drukte > 1 ? kleuren[drukte] : 'var(--color-grey)'} />
</svg>
