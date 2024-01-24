<script>
	import { metersToKilometers } from '$lib/utils/numbers.js';
	import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
	import { obstakels } from '$lib/stores.js';
	import infoIcon from '$lib/images/info.svg';
	import Drukteicon from '$lib/image-components/drukteicon.svelte';
	import Basebutton from '$lib/components/Basebutton.svelte';
	import clockIcon from '$lib/images/clock.svg';

	let open = false;
	let danger = 1;

	const obstakel = $obstakels[0];
	const setOpen = () => (open = !open);
</script>

<section class="obstakel container">
	<button on:click={setOpen} class="obstakelsection">
		<div class="obstakel__icon">
			<ObstakelIcon type={obstakel.type} />
		</div>
		<div class="obstakel__info">
			<div class="obstakel__info-top">
				<h3>{obstakel.name}</h3>
				<img src={infoIcon} alt="info" />
			</div>
			<div class="obstakel__info-bottom">
				<p>{metersToKilometers(obstakel.afstand)}</p>
				<p><span>&#9679;</span> {obstakel.description}</p>
			</div>
		</div>
	</button>
	{#if open}
		<div class="content-open">
			<h3 class="obstakel-info-reden">Waarom is dit kruispunt gevaarlijk?</h3>
			<section class="details-data">
				<Drukteicon drukte={danger} />
				{#if danger === 0}
					<p>Niet druk</p>
				{:else if danger === 1}
					<p>Redelijk druk</p>
				{:else if danger === 2}
					<p>Erg druk</p>
				{/if}
			</section>

			<section class="wachttijd">
				<img src={clockIcon} alt="" />
				<p>Weggebruikers wachten hier gemiddeld <strong>4 min</strong></p>
			</section>

			<p>Relatief veel weggebruikers rijden op dit punt door rood.</p>
			<Basebutton label="Dit obstakel vermijden" />
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

				p {
					font-size: 1rem;
				}
			}
		}
	}
</style>
