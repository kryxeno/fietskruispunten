<script>
	import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
	import editIcon from '$lib/images/edit.svg';
	import Switch from '$lib/components/Switch.svelte';
	import Basebutton from '$lib/components/Basebutton.svelte';
	import {
		fietsvriendelijk,
		expert,
		expertKaart,
		expertOptions,
		route,
		punten
	} from '$lib/stores.js';
	import ObstakelOverview from '$lib/components/ObstakelOverview.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Geocoder from '$lib/components/Geocoder.svelte';

	export let geocoderElement;
	const changeMode = () => ($expert = !$expert);

	$: {
		if ($fietsvriendelijk && $punten) {
			punten.set(
				$punten.map((punt) => {
					if (punt.properties.danger === 2) {
						return {
							...punt,
							properties: {
								...punt.properties,
								rerouted: true
							}
						};
					} else {
						return punt;
					}
				})
			);
			// 	$punten
			// 		.filter((p) => p.properties.danger === 2)
			// 		.forEach((punt) => (punt.properties.rerouted = true));
		}
	}
</script>

<section class="sidebar">
	{#if $expert}
		<div style="padding: 1rem 1rem 0 1rem;">
			<h2>Expert modus</h2>
		</div>
		<hr />
		<div class="container">
			<div class="route-display">
				<div class="route-display__edit">
					<img src={editIcon} alt="edit route" />
				</div>
				<section class="route-display__locations">
					<p>
						<span>Van</span>
						{$route.waypoints[0].name !== '' ? $route.waypoints[0].name : 'Loading...'}
					</p>
					<p>
						<span>Naar</span>
						{$route.waypoints.at(-1).name !== '' ? $route.waypoints.at(-1).name : 'Loading...'}
					</p>
				</section>
			</div>
		</div>
		<hr />
		<div class="container half">
			<Basebutton
				label={'Terug naar basis modus'}
				backgroundColor="var(--color-blue-dark)"
				on:click={changeMode}
			/>
		</div>
		<hr />
		<div class="container half">
			<Switch label="Toon kaart" bind:checked={$expertKaart} />
		</div>
		<hr />
		<section class="container half kaart-options">
			<p>Laten zien op de kaart</p>
			<ul>
				{#each $expertOptions as { name, type, state }}
					<li>
						<button class={!$punten.find((p) => p.properties.type === type) && 'disabled'}>
							<ObstakelIcon {type} stroke="transparent" />
							<p>
								({$punten.filter((p) => p.properties.type === type && !p.properties.rerouted)
									.length})
							</p>
							<Checkbox label={name} bind:checked={state} />
						</button>
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<div style="padding: 1rem 1rem 0 1rem;">
			<h2>Mijn fietsroute</h2>
		</div>
		<hr />
		<div class="container">
			<div class="inputs">
				<div class="icons">
					<ObstakelIcon type={'startpunt'} small transition={false} />
					<div />
					<ObstakelIcon type={'eindpunt'} small transition={false} />
				</div>
				<Geocoder {geocoderElement} />
			</div>
		</div>
		<hr />
		<div class="container half">
			<Switch
				label="Fietsvriendelijk"
				bind:checked={$fietsvriendelijk}
				backgroundColor="var(--color-success)"
			/>
		</div>
		<hr />
		<div class="container half">
			<Basebutton
				label={'Route in expert modus bekijken'}
				backgroundColor="var(--color-blue-dark)"
				on:click={changeMode}
			/>
		</div>
		<ObstakelOverview />
	{/if}
</section>

<style lang="scss">
	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		z-index: 1000;
		overflow: hidden;
		border-right: 1px solid var(--color-grey);

		hr {
			flex-shrink: 0;
		}

		.container {
			padding: 1rem 1rem;

			&.half {
				padding: 0.5rem 1rem;
			}
		}

		.route-display {
			display: flex;
			gap: 1rem;

			&__edit {
				flex-shrink: 0;
			}

			&__locations {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				width: 100%;
				overflow: hidden;

				p {
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					span {
						color: var(--color-grey-dark);
					}
				}
			}
		}

		.kaart-options {
			ul {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				margin: 1rem 0;

				button {
					display: flex;
					align-items: center;
					border: 1px solid var(--color-grey);
					padding: 1rem;
					width: calc(100% - 2rem);
					gap: 0.5rem;

					&.disabled {
						opacity: 0.5;
						pointer-events: none;
					}

					p {
						white-space: nowrap;
					}
				}
			}
		}

		.inputs {
			display: flex;

			.icons {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 0.5rem 1rem 0.5rem 0;
				flex-shrink: 0;

				div {
					height: 1.4rem;
					border-right: 2px solid var(--color-grey);
					width: 2px;
				}
			}
		}
	}
</style>
