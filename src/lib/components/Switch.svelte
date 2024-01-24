<script>
	import { createSwitch } from 'svelte-headlessui';

	export let label = undefined;
	export let checked;
	export let backgroundColor = 'var(--color-blue-dark)';
	export let invert = false;
	export let disabled = null;

	const sw = createSwitch({ label, checked: invert ? !checked : checked });
	$: checked = invert ? !$sw.checked : $sw.checked;

	$: {
		if (disabled) $sw.checked = false;
	}
</script>

<div class="switch {disabled ? 'disabled' : ''}" use:sw.toggle>
	{#if label}
		<label for="switch" class="switch-label">{label}</label>
	{/if}
	<button class="switch-button" style={$sw.checked && `background-color: ${backgroundColor}`}>
		<span class={$sw.checked && 'active'} />
	</button>
</div>

<style lang="scss">
	.switch {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		transition: opacity 0.3s;

		&.disabled {
			opacity: 0.5;
			pointer-events: none;

			.switch-button {
				cursor: not-allowed;
				background-color: var(--color-grey) !important;
			}
		}

		.switch-button {
			display: flex;
			align-items: center;
			background-color: var(--color-grey);
			height: 1.3rem;
			width: 2.2rem;
			border-radius: 99px;
			transition: background-color 0.2s;
			cursor: pointer;

			span {
				display: block;
				background-color: #ffffff;
				height: 0.9rem;
				width: 0.9rem;
				border-radius: 99px;
				translate: 0.2rem 0;
				transition: translate 0.2s;

				&.active {
					translate: 1.1rem 0;
				}
			}
		}
	}
</style>
