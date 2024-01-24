<script>
	import { metersToKilometers } from '$lib/utils/numbers.js';
	import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
	import closeIcon from '$lib/images/close.svg';
	import Basebutton from '$lib/components/Basebutton.svelte';
	import clockIcon from '$lib/images/clock.svg';
	import { fade } from 'svelte/transition';
	import { activePoint, punten, route, fietsvriendelijk } from '$lib/stores.js';
	import infoIcon from '$lib/images/info.svg';

	let actief;
	let index = 0;

	$: if ($activePoint && $punten) {
		actief = $punten.find((punt) => punt.properties.id === $activePoint);
		index = $punten.findIndex((punt) => punt.properties.id === $activePoint);
		console.log('refreshedpunt');
	}

	const resetActivePoint = () => ($activePoint = null);

	const vermijdObstakel = () => {
		punten.update((array) =>
			array.map((punt) =>
				punt.properties.id === $activePoint
					? { ...punt, properties: { ...punt.properties, rerouted: !punt.properties.rerouted } }
					: punt
			)
		);
	};

	let totalDistance = 0;

	$: if ($route) {
		totalDistance = $route.summary.totalDistance;
	}

	const displayNames = {
		stoplicht: ['Veilig stoplicht', 'Stoplicht', 'Onveilig stoplicht'],
		kruispunt: ['Rustig kruispunt', 'Kruispunt', 'Gevaarlijk kruispunt']
	};
</script>

<section transition:fade={{ duration: 200 }} class="obstakel container">
	<div class="obstakelsection">
		<div class="obstakel__icon">
			<ObstakelIcon
				type={actief.properties.type}
				stroke={!actief.properties.rerouted ? actief.properties.danger : 'var(--color-grey)'}
			/>
		</div>
		<div class="obstakel__info">
			<div class="obstakel__info-top">
				<h3>{displayNames[actief.properties.type][actief.properties.danger]}</h3>
				<button on:click={resetActivePoint}>
					<img src={closeIcon} alt="close" />
				</button>
			</div>
			<div class="obstakel__info-bottom">
				<p>
					{metersToKilometers(
						($route.waypointIndices[index + 1] / $route.waypointIndices.at(-1)) * totalDistance
					)}
				</p>
				<p>
					<span>&#9679;</span>
					{$route.waypoints[index].name !== '' ? $route.waypoints[index].name : 'Locatie...'}
				</p>
			</div>
		</div>
	</div>
	<div class="content-open">
		{#if actief.properties.type === 'stoplicht'}
			<section class="wachttijd">
				<img src={clockIcon} alt="tijdsduur icoon" />
				<p>Weggebruikers wachten hier gemiddeld <strong>{'?'} min</strong></p>
			</section>
		{:else if actief.properties.type === 'kruispunt'}
			<h3 class="obstakel-info-reden">Doorstroom van het verkeer</h3>
		{/if}

		<section class="details-data">
			<div class="onderwerpen-titels">
				<p>Deelconflict</p>
				<p>Rijd door rood</p>
				<p>Ongevallen</p>
				<p>Gewonden</p>
			</div>

			<div class="onderwerpen-stats">
				<p><strong>{actief.properties.deelconfli ?? 0}</strong></p>
				<p><strong>{actief.properties['doorrijd%'] ?? 0}%</strong></p>
				<p><strong>{actief.properties['#ongeval'] ?? 0}</strong> (in 12 maanden)</p>
				<p><strong>{actief.properties.gewonden ?? 0}</strong> (in 12 maanden)</p>
			</div>
		</section>
		<Basebutton
			label={actief.properties.rerouted ? 'Obstakel terugzetten' : 'Dit obstakel vermijden'}
			backgroundColor={`var(--color-${actief.properties.rerouted ? 'blue-dark' : 'primary'})`}
			on:click={vermijdObstakel}
			disabled={$fietsvriendelijk || !actief.properties.canReroute}
		/>
		{#if $fietsvriendelijk}
			<p>
				<img src={infoIcon} alt="info" />
				De fietsvriendelijk knop staat aan, waardoor u niet dit punt kan aanpassen.
			</p>
		{:else if !actief.properties.canReroute}
			<p>
				<img src={infoIcon} alt="info" />
				Er is geen alternatieve route voor dit punt.
			</p>
		{/if}
	</div>
</section>

<style lang="scss">
	.obstakel-info-reden {
		font-size: 1em;
		font-weight: bolder;
	}

	.container {
		padding: 1rem;
	}

	.obstakel {
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--color-grey);
		gap: 1.5rem;
		width: 23rem;
		flex-shrink: 0;

		h3 {
			font-size: 1rem;
			font-weight: 600;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}

		.content-open {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;

			> p {
				display: flex;
				align-items: flex-start;
				gap: 0.5rem;
			}

			.details-data {
				display: grid;
				grid-template-columns: 4fr 6fr;
				background-color: var(--color-grey-light);
				padding: 0.5rem;
			}

			.wachttijd {
				display: flex;
				gap: 0.5rem;

				img {
					height: fit-content;
				}
			}
		}

		.obstakelsection {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

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

			span {
				display: inline-block;
				transform: translateY(-2px);
				color: var(--color-grey);
				font-size: 0.8rem;
				margin-right: 0.2rem;
			}

			&-bottom {
				display: flex;
				gap: 0.5rem;
				p:first-child {
					text-overflow: unset;
					overflow: visible;
				}
			}

			&-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 0.5rem;

				button {
					cursor: pointer;
				}

				img {
					height: 2rem;
					aspect-ratio: 1;
				}
			}
		}
	}
</style>
