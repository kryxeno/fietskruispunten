<script>
	import Switch from '$lib/components/Switch.svelte';
	import { metersToKilometers } from '$lib/utils/numbers.js';
	import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
	import { punten, route } from '$lib/stores.js';

	const getObstakels = () => {
		return $punten.filter((punt) => punt.properties.danger === 2);
	};

	const generateDescription = ({
		type,
		deelconfli: deelconflict,
		'#ongeval': ongevallen,
		'doorrijd%': roodRijders
	}) => {
		if (type === 'stoplicht') {
			if (ongevallen >= 2) return 'Er zijn veel ongevallen gebeurd bij dit stoplicht';
			else if (roodRijders >= 50) return 'Er rijden veel mensen door rood bij dit stoplicht';
			else if (deelconflict > 0) return 'Autos moeten hier vaak wachten op fietsers';
			else return 'Dit stoplicht is onveilig';
		} else if (type === 'kruispunt') {
			if (ongevallen >= 2) return 'Er zijn veel ongevallen gebeurd bij dit kruispunt';
			else if (deelconflict > 0) return 'Autos moeten hier vaak wachten op fietsers';
			else return 'Dit kruispunt is onveilig';
		} else if (type === 'werkzaamheden') {
			return 'Er is werk aan de weg';
		}
	};
</script>

<section class="obstakel-overview">
	<div class="counter container">
		Obstakels <span>&nbsp;({$punten ? getObstakels().length : '0'})</span>
	</div>
	{#if !$punten}
		<div class="container">
			<p>Geen obstakels gevonden</p>
		</div>
	{:else}
		<ul class="obstakels">
			{#each $punten as { properties: punt }, index}
				{#if punt.danger === 2}
					<li class="obstakel container">
						<div class="obstakel__icon">
							<ObstakelIcon type={punt.type} />
						</div>
						<div class="obstakel__info">
							<div class="obstakel__info-top">
								<h3>
									{#if $route && $route.waypoints[index + 1].name !== ''}
										{$route.waypoints[index + 1].name}
									{:else}
										{punt.type}
									{/if}
								</h3>
								<p>
									<span>&#9679;</span>
									{#if $route}
										{metersToKilometers(
											($route.waypointIndices[index + 1] / $route.waypointIndices.at(-1)) *
												$route.summary.totalDistance
										)}
									{:else}
										...
									{/if}
								</p>
								<Switch bind:checked={punt.rerouted} invert />
							</div>
							<p>{generateDescription(punt)}</p>
						</div>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
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
			overflow: hidden auto;
			max-height: max(18rem, 32svh);

			.obstakel {
				display: flex;
				align-items: center;
				border-top: 1px solid var(--color-grey);
				background-color: #fafafa;
				gap: 0.5rem;

				&__icon {
					flex-shrink: 0;
				}

				&__info {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
					width: 100%;
					overflow: hidden;

					p {
						font-size: 0.9rem;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}

					&-top {
						display: grid;
						grid-template-columns: 1fr 5rem 2.2rem;
						align-items: center;
						gap: 0.5rem;

						h3 {
							font-size: 1rem;
							font-weight: 400;
							color: var(--color-blue-dark);
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
							text-transform: capitalize;
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
