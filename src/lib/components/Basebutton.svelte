<script>
	export let label = 'Button';
	export let backgroundColor = 'var(--color-primary)';
	export let color = '#fff';
	export let fill = true;
	export let disabled = false;
</script>

<section class="button-container {disabled ? 'disabled' : ''}">
	<button
		on:click
		style="background-color: {backgroundColor}; color: {color}; {!fill && 'width: fit-content'}"
	>
		{label}
	</button>
</section>

<style lang="scss">
	.button-container {
		width: 100%;

		&.disabled {
			opacity: 0.5;
			pointer-events: none;

			button {
				background-color: var(--color-grey) !important;
				color: black !important;
			}
		}

		button {
			padding: 0.8rem 1rem;
			width: calc(100% - 2rem);
			font-weight: 600;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			transition: opacity 0.3s;

			&:hover {
				background-color: var(--color-primary) !important;
			}
		}
	}
</style>
