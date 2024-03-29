<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import routepunten from '$lib/routing/routes.js';
	import '$lib/css/leaflet.css';
	import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
	import Coordinates from '$lib/components/Coordinates.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Routebalk from '$lib/components/Routebalk.svelte';
	import { route, expert, expertKaart, expertOptions, punten, activePoint } from '$lib/stores.js';
	import startpunt from '$lib/images/startpunt.svg';
	import eindpunt from '$lib/images/eindpunt.svg';
	import {
		getRoutePoints,
		getWaypointsById,
		getCoordinatesById,
		updateCoordinatesByWaypoints
	} from '$lib/routing/calculateRoute.js';
	import { updateMarkers } from '$lib/routing/marker.js';
	import Obstakelinfo2 from '$lib/components/Obstakelinfo2.svelte';
	import Obstakelinfo from '$lib/components/Obstakelinfo.svelte';

	const endingCoordinates = [52.380957, 4.860238];
	const startingCoordinates = [52.358933, 4.909387];

	let mapElement;
	let map;
	let lat = startingCoordinates[0];
	let lng = startingCoordinates[1];
	let zoom = 14.5;
	let geocoderElement;
	let L;
	let control = null;

	onMount(async () => {
		if (browser) {
			await import('leaflet').then(async (leaflet) => {
				L = leaflet.default;
				map = L.map(mapElement).setView(startingCoordinates, 14.5);
				console.log('Loading Leaflet map.');
				L.tileLayer('https://{s}.data.amsterdam.nl/topo_wm_zw/{z}/{x}/{y}.png', {
					attribution: `Topografische ondergrond © Gemeente Amsterdam`,
					subdomains: ['t1', 't2', 't3', 't4'],
					maxZoom: 21,
					minZoom: 11
				}).addTo(map);

				const { stoplicht, kruispunt } = await getRoutePoints(routepunten);

				const intermediaryWaypointIds = [
					41024, 41023, 105, 52622, 54122, 58922, 57822, 104, 113, 50222, 15822, 114, 12722, 13022,
					13028, 125, 124
				];

				$punten = await getWaypointsById(intermediaryWaypointIds, [...stoplicht, ...kruispunt]);

				const waypoints = await getCoordinatesById(intermediaryWaypointIds, [
					...stoplicht,
					...kruispunt
				]);

				await import('leaflet-routing-machine').then(async () => {
					await import('$lib/routing/Control.Geocoder.js');
					control = L.Routing.control({
						waypoints: [
							L.latLng(startingCoordinates[0], startingCoordinates[1]),
							...waypoints,
							L.latLng(endingCoordinates[0], endingCoordinates[1])
						],
						addWaypoints: false,
						draggableWaypoints: false,
						geocoder: L.Control.Geocoder.nominatim(),
						lineOptions: {
							styles: [
								{
									color: 'var(--color-blue)',
									opacity: 1,
									weight: 4
								}
							]
						},
						createMarker: (i, wp, n) => {
							if (i === 0) {
								return L.marker(wp.latLng, {
									draggable: false,
									icon: L.icon({
										iconUrl: startpunt,
										iconSize: [28, 28]
									})
								});
							}
							if (i === n - 1) {
								return L.marker(wp.latLng, {
									draggable: false,
									icon: L.icon({
										iconUrl: eindpunt,
										iconSize: [28, 28]
									})
								});
							}
						}
					});
					control.on('routesfound', (e) => {
						console.log('route found ');
						const waypoints = control.getWaypoints();
						$route = { ...e.routes[0], waypoints };
					});
					const controlDiv = control.onAdd(map);
					geocoderElement = controlDiv.firstChild;
				});
				map.on('mousemove', (e) => {
					lat = e.latlng.lat.toFixed(6);
					lng = e.latlng.lng.toFixed(6);
				});

				map.on('zoomend', () => {
					zoom = map.getZoom();
				});

				map.on('click', (e) => {
					if (e.originalEvent.target.classList.contains('map')) $activePoint = null;
				});
			});
		}
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});

	$: {
		if ($punten && map) {
			updateMarkers(L, map, $punten, $expertOptions, $expert);
		}
	}

	$: {
		const update = async () => {
			const newCoordinates = await updateCoordinatesByWaypoints($punten);
			control.setWaypoints([
				L.latLng(startingCoordinates[0], startingCoordinates[1]),
				...newCoordinates,
				L.latLng(endingCoordinates[0], endingCoordinates[1])
			]);
		};
		if (L && control) update();
	}
	let popupCoordinaten = 'left: 0px; top: 0px;';

	$: {
		map &&
			map.on('move', function () {
				if ($activePoint && map && $punten) {
					const containerpoint = map.latLngToContainerPoint(
						$punten.find((p) => p.properties.id === $activePoint).geometry.coordinates
					);
					popupCoordinaten = `left:${containerpoint.x}px; top:${containerpoint.y}px;`;
				}
			});
		if ($activePoint && map && $punten) {
			const containerpoint = map.latLngToContainerPoint(
				$punten.find((p) => p.properties.id === $activePoint).geometry.coordinates
			);
			popupCoordinaten = `left:${containerpoint.x}px; top:${containerpoint.y}px;`;
		}
	}
</script>

<section class="map-content">
	<Sidebar {geocoderElement} />
	<div class="main-content {$expert && !$expertKaart ? 'no-bg' : ''}">
		<Routebalk />
		<div class="map-toggle">
			{#if $expert && $activePoint}
				<Obstakelinfo2 />
			{/if}
			<div
				bind:this={mapElement}
				class="map"
				style="background-color: {$expert && !$expertKaart ? '#000' : '#ddd'}"
			>
				{#if $punten && !$expert && $activePoint}
					<div class="popup-wrapper" style={popupCoordinaten}>
						<Obstakelinfo />
					</div>
				{/if}
				<Coordinates {zoom} {lat} {lng} />
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	section.map-content {
		display: grid;
		grid-template-columns: 25rem 1fr;
		height: 100%;

		.map {
			height: 100%;
			width: 100%;
			transition: background-color 0.5s;

			.popup-wrapper {
				position: absolute;
				translate: -50% 0;
				z-index: 999;
			}
		}

		.main-content {
			display: grid;
			grid-template-rows: 8rem 1fr;
		}
		.map-toggle {
			display: flex;
		}
	}

	:global(.route-marker) {
		width: 2.5rem !important;
		height: 2.5rem !important;
		display: flex;
		justify-content: center;
		align-items: center;
		translate: -50% -50%;
	}

	:global(.fade-in > div) {
		opacity: 0;
		animation: fadeIn 0.8s forwards;
	}
	:global(.stopl) {
		border-color: var(--color-blue);
	}

	:global(.kruisp) {
		border-color: orange;
	}
</style>
