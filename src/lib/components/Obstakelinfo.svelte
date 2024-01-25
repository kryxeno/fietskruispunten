<script>
	import { metersToKilometers } from '$lib/utils/numbers.js';
	import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
	import infoIcon from '$lib/images/info.svg';
	import Drukteicon from '$lib/image-components/drukteicon.svelte';
	import Basebutton from '$lib/components/Basebutton.svelte';
	import clockIcon from '$lib/images/clock.svg';
	import { route, punten, activePoint, fietsvriendelijk } from '$lib/stores.js';

	let open = false;
	let index = 0;
	let actief;

	const setOpen = () => (open = !open);

	$: if ($activePoint && $punten) {
		actief = $punten.find((punt) => punt.properties.id === $activePoint);
		index = $punten.findIndex((punt) => punt.properties.id === $activePoint);
		open = false;
		console.log(actief);
	}

	const vermijdObstakel = () => {
		punten.update((array) =>
			array.map((punt) =>
				punt.properties.id === actief.properties.id
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

<section class="obstakel container">
	<button on:click={setOpen} class="obstakelsection">
		<div class="obstakel__icon">
			<ObstakelIcon
				type={actief.properties.type}
				stroke={!actief.properties.rerouted ? actief.properties.danger : 'var(--color-grey)'}
				transition={false}
			/>
		</div>
		<div class="obstakel__info">
			<div class="obstakel__info-top">
				<h3>{displayNames[actief.properties.type][actief.properties.danger]}</h3>
				<img src={infoIcon} alt="info" />
			</div>
			<div class="obstakel__info-bottom">
				{#if $route}
					<p>
						{metersToKilometers(
							($route.waypointIndices[index + 1] / $route.waypointIndices.at(-1)) * totalDistance
						)}
					</p>
					<p>
						<span>&#9679;</span>
						{$route.waypoints[index].name !== '' ? $route.waypoints[index].name : 'Locatie...'}
					</p>
				{/if}
			</div>
		</div>
	</button>
	{#if open}
		<div class="content-open">
			<h3 class="obstakel-info-reden">Waarom is dit kruispunt gevaarlijk?</h3>
			{#if actief.properties.type === 'stoplicht'}
				{#if actief.properties['doorrijd%'] > 50}
					<p>Relatief veel weggebruikers rijden op dit punt door rood.</p>
				{:else}
					<section class="wachttijd">
						<img src={clockIcon} alt="clock icon" />
						<p>Weggebruikers wachten hier gemiddeld <strong>{'?'} min</strong></p>
					</section>
				{/if}
			{:else if actief.properties.type === 'kruispunt'}
				<section class="details-data">
					<Drukteicon drukte={actief.properties.danger} />
					{#if actief.properties.danger === 0}
						<p>Niet druk</p>
					{:else if actief.properties.danger === 1}
						<p>Redelijk druk</p>
					{:else if actief.properties.danger === 2}
						<p>Erg druk</p>
					{/if}
				</section>
			{/if}
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
	{/if}
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
		border: 1px solid var(--color-grey);
		gap: 1.5rem;
		width: 23rem;
		flex-shrink: 0;
		background-color: #fff;

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
			gap: 1rem;

			> p {
				display: flex;
				align-items: flex-start;
				gap: 0.5rem;
			}

			.details-data {
				display: flex;
				gap: 0.6rem;
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
			cursor: pointer;
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

				img {
					width: 1.4rem;
					height: 1.4rem;
				}
			}
		}
	}
</style>
