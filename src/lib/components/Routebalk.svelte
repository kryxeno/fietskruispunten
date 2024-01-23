<script>
	import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
	import { route, expert, expertOptions, punten } from '$lib/stores.js';
	import { metersToKilometers, secondsToMinutes } from '$lib/utils/numbers.js';

	// Ik weet niet waarom deze soms niet werkt, maar dit is een workaround.
	// De store update met een empty string maar toch krijgt hij de volledige string er in.
	// Hij update alleen niet opnieuw wanneer deze 'volledig' is geupdate. Het is een beetje alsof hij de plek reserveert voor een string, maar niet de volledige string in een keer er in zit.
	// Het is sowieso geen probleem wanneer de gebruiker een nieuwe locatie selecteert. Het gebeurt alleen wanneer er voorgeselecteerde waypoints onmount geselecteerd zijn.
	setTimeout(() => {
		$route = $route;
	}, 1500);
</script>

<div class="timeline-container">
	<div class="route-line">
		<div class="route-icon wp">
			<ObstakelIcon type={'startpunt'} small />
		</div>
		<div class="route-icon wp" style="right: 0; ">
			<ObstakelIcon type={'eindpunt'} small />
		</div>
		{#if $route}
			{#each $punten as { properties: { type, rerouted, danger } }, index}
				<div
					class="route-icon"
					style="left: {($route.waypointIndices[index + 1] / $route.waypointIndices.at(-1)) *
						100}%; "
				>
					{#if ($expertOptions.find((o) => o.type === type)?.state || type === 'werkzaamheden') && ($expert || (!$expert && danger === 2)) && !rerouted}
						<ObstakelIcon {type} stroke={danger} />
					{/if}
				</div>
			{/each}
		{/if}
		<div class="route-labels start">
			<p>0 km</p>
			<p>
				{#if $route && $route.waypoints[0].name !== ''}
					{$route.waypoints[0].name}
				{:else}
					Start
				{/if}
			</p>
		</div>
		<div class="route-labels eind">
			<p>
				{#if $route}
					{metersToKilometers($route.summary.totalDistance)} / {secondsToMinutes(
						$route.summary.totalTime * 2
					)}
				{/if}
			</p>
			<p>
				{#if $route && $route.waypoints.at(-1).name !== ''}
					{$route.waypoints.at(-1).name}
				{:else}
					Eind
				{/if}
			</p>
		</div>
	</div>
</div>

<style lang="scss">
	.route-labels {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 3rem;

		p {
			font-size: 0.8rem;
			max-width: 12rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		&.eind {
			right: 0%;
			p {
				text-align: right;
			}
		}
	}

	.timeline-container {
		position: relative;
		padding: 0 3rem;
		height: 8rem;
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--color-grey);
	}

	.route-line {
		height: 4px;
		background-color: black;
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.route-icon {
		position: absolute;
		translate: -50% 0;

		&.wp {
			translate: 0;
		}
	}
</style>
