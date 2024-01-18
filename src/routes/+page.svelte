<script>
	import LeafletMap from '$lib/LeafletMap.svelte';
	import xxx from '$lib/images/xxx.svg';

	let page = 2;

	const setPage = (newPage) => {
		page = newPage;
	};
</script>

<header>
	<div class="logo">
		<a
			href="https://maps.amsterdam.nl/"
			target="_blank"
			aria-label="Naar startpagina Maps Amsterdam"
			tabindex="0"
			><img
				class="xxx"
				alt="Naar startpagina Maps Amsterdam"
				aria-label="Naar startpagina Maps Amsterdam"
				src={xxx}
			/>
			<h3 aria-label="Naar startpagina Maps Amsterdam">Gemeente<br />Amsterdam</h3>
		</a>
	</div>
	<h1>Fietskruispunten</h1>
	<button class="burger">
		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>
	</button>
	<button class="info">i</button>
</header>
<nav>
	<ul>
		<li>
			<button on:click={() => setPage(1)} class={page === 1 && 'active'}> Introductie </button>
		</li>
		<li>
			<button on:click={() => setPage(2)} class={page === 2 && 'active'}>
				Fietsroute planner
			</button>
		</li>
	</ul>
</nav>
<main>
	<!-- <Test route={{start:"Charlotte de Bourbonstraat 2", eind:"HvA (TTH)"}}/> -->
	<LeafletMap />

</main>

<style lang="scss">
	@import './globals.css';
	nav {
		position: relative;
		z-index: 1000;
		background-color: var(--color-grey);
		padding: 0 3rem;
		height: var(--nav-menu-height);
		box-shadow: 2px 2px 2px rgba(51, 51, 51, 0.3);

		ul {
			display: flex;
			align-items: center;
			gap: 3rem;
			height: 100%;

			li,
			li button {
				height: 100%;
			}
			li button {
				display: flex;
				align-items: center;
				font-weight: 600;
				cursor: pointer;

				&.active {
					color: var(--color-primary);
				}
			}
		}
	}
	header {
		height: var(--nav-height);
		display: flex;
		align-items: center;
		gap: 2rem;
		padding-right: 2rem;

		h1 {
			font-size: 26px;
			font-weight: 600;
		}

		.burger {
			margin-left: auto;
			width: 1.5rem;
			height: 1rem;
			position: relative;
			cursor: pointer;

			.line {
				width: 100%;
				height: 0.2rem;
				background: #000;
				position: absolute;
				left: 0;
				transition: all 0.5s ease;
				&:nth-child(1) {
					top: 0;
				}
				&:nth-child(2) {
					top: 0.5rem;
				}
				&:nth-child(3) {
					top: 1rem;
				}
			}
		}

		.info {
			width: 2rem;
			height: 2rem;
			background: var(--color-info);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: all 0.5s ease;
			font-size: 1.5rem;
			font-weight: 600;
			&:hover {
				background: var(--color-primary);
				color: #fff;
			}
		}

		.logo {
			a {
				display: flex;
				align-items: center;

				h3 {
					color: var(--color-primary);
					margin: -5px 0 11px 8px;
					background: 0 0;
					font-size: 1rem;
					line-height: 1;
					font-weight: 600;
				}
				.xxx {
					height: 43px;
					margin: 11px 0 11px 20px;
					border: 0;
				}
			}
		}
	}

	main {
		height: calc(100% - var(--nav-menu-height) - var(--nav-height));
		position: relative;
	}
</style>
