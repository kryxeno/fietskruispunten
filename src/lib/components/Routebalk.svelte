<script>
	import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
	import StartEindIcon from '$lib/components/StartEindIcon.svelte';
	import { obstakels, route } from '$lib/stores.js';
	import { metersToKilometers, secondsToMinutes } from '$lib/utils/numbers.js';
	import { fade } from 'svelte/transition';

	// Ik weet niet waarom deze soms niet werkt, maar dit is een workaround.
	// De store update met een empty string maar toch krijgt hij de volledige string er in.
	// Hij update alleen niet opnieuw wanneer deze 'volledig' is geupdate.
	setTimeout(() => {
		$route = $route;
	}, 1500);
</script>

<div class="timeline-container">
	<div class="route-line">
		<StartEindIcon type={'start'} afstand={0} />
		<StartEindIcon type={'eind'} afstand={100} />
		{#if $route}
			{#each $obstakels as { type, afstand, actief }}
				{#if actief}
					<div
						class="route-icon"
						transition:fade={{ duration: 200 }}
						style="left: {(afstand / $route.summary.totalDistance) * 100}%; "
					>
						<ObstakelIcon {type} />
					</div>
				{/if}
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
						$route.summary.totalTime
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
		border-left: 1px solid var(--color-grey);
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
		width: 3rem;
		aspect-ratio: 1;
	}
</style>
