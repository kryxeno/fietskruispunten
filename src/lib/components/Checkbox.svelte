<script>
	import { createSwitch } from 'svelte-headlessui';
	import checkIcon from '$lib/images/check.svg';

	export let label = undefined;
	export let checked;

	const sw = createSwitch({ label, checked });
	$: checked = $sw.checked;
</script>

<div class="switch" use:sw.toggle>
	{#if label}
		<label for="switch" class="switch-label">{label}</label>
	{/if}
	<button class="switch-button">
		<img src={checkIcon} alt="check" style="opacity: {$sw.checked ? '1' : '0'};" />
	</button>
</div>

<style lang="scss">
	.switch {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		.switch-button {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid var(--color-grey);
			height: 1.6rem;
			width: 1.6rem;
			cursor: pointer;

			img {
				transition: opacity 0.2s;
			}
		}
	}
</style>
