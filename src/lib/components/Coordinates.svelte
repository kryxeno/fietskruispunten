<script>
	export let zoom = 0;
	export let lat = 0;
	export let lng = 0;
</script>

<div class="coordinates">
	<p>{zoom}&nbsp;</p>
	<p>- {lat}</p>
	<p>- {lng}</p>
</div>

<style lang="scss">
	.coordinates {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		height: fit-content;
		background: #fff;
		opacity: 0.7;
		z-index: 1000;
		padding: 0 0.5rem;

		p {
			color: rgb(51, 51, 51);
			font-size: 0.7rem;
			font-weight: 600;
			line-height: 1rem;
			white-space: nowrap;

			&:not(:first-child) {
				width: 4.4rem;
			}

			&:last-child {
				width: 3.6rem;
			}
		}
	}
</style>
