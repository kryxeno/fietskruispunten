<script>
	import Switch from '$lib/components/Switch.svelte';
	import { metersToKilometers } from '$lib/utils/numbers.js';

	export let obstakels = null;
</script>

<section class="obstakel-overview">
	<div class="counter container">
		Obstakels <span>&nbsp;({$obstakels.filter((obstakel) => obstakel.actief).length})</span>
	</div>
	<ul class="obstakels">
		{#each $obstakels as obstakel}
			<li class="obstakel container">
				<div class="obstakel__icon">
					<!-- <img src={obstakel.icon} alt={obstakel.name} /> -->
				</div>
				<div class="obstakel__info">
					<div class="obstakel__info-top">
						<h3>{obstakel.name}</h3>
						<p><span>&#9679;</span> {metersToKilometers(obstakel.afstand)}</p>
						<Switch bind:checked={obstakel.actief} />
					</div>
					<p>{obstakel.description}</p>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	.obstakel-overview {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-grey);

		.counter {
			display: flex;
			justify-content: center;
			align-items: center;
			span {
				font-weight: 600;
			}
		}

		.container {
			padding: 1rem;
		}

		.obstakels {
			display: flex;
			flex-direction: column;

			.obstakel {
				display: flex;
				align-items: center;
				border-top: 1px solid var(--color-grey);
				background-color: #fafafa;

				&__info {
					display: flex;
					flex-direction: column;
					width: 100%;
					gap: 0.5rem;

					p {
						font-size: 0.9rem;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}

					&-top {
						display: grid;
						grid-template-columns: 1fr 5rem 3rem;
						align-items: center;
						gap: 0.5rem;

						h3 {
							font-size: 1rem;
							font-weight: 400;
							color: var(--color-blue-dark);
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
						}

						p {
							font-size: 1rem;

							span {
								display: inline-block;
								transform: translateY(-2px);
								color: var(--color-grey);
								font-size: 0.8rem;
								margin-right: 0.2rem;
							}
						}
					}
				}
			}
		}
	}
</style>
