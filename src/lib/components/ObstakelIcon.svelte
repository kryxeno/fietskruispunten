<script>
	// import startpunt from '$lib/images/startpunt.png';
	// import eindpunt from '$lib/images/eindpunt.png';
	import stoplicht from '$lib/images/stoplicht.svg';
	import fietswegen from '$lib/images/fietswegen.svg';
	import kruispunten from '$lib/images/kruispunten.svg';

	export let type = 'stoplicht';

	const icons = {
		stoplicht: stoplicht,
		fietswegen: fietswegen,
		kruispunten: kruispunten
	};
</script>

<img src={icons[type]} alt="ongeval icoon" />
