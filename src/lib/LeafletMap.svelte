<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import routepunten from '$lib/routes.js';
	import '$lib/css/leaflet.css';
	import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
	import Coordinates from '$lib/components/Coordinates.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Routebalk from '$lib/components/Routebalk.svelte';
	import { route, expert, expertKaart } from '$lib/stores.js';
	import startpunt from '$lib/images/startpunt.svg';
	import eindpunt from '$lib/images/eindpunt.svg';

	const endingCoordinates = [52.380957, 4.860238];
	const startingCoordinates = [52.358933, 4.909387];

	let mapElement;
	let map;
	let lat = startingCoordinates[0];
	let lng = startingCoordinates[1];
	let zoom = 14.5;
	let geocoderElement;

	onMount(async () => {
		if (browser) {
			await import('leaflet').then(async (leaflet) => {
				const L = leaflet.default;
				map = L.map(mapElement).setView(startingCoordinates, 14.5);
				console.log('Loading Leaflet map.');
				L.tileLayer('https://{s}.data.amsterdam.nl/topo_wm_zw/{z}/{x}/{y}.png', {
					attribution: `Topografische ondergrond © Gemeente Amsterdam`,
					subdomains: ['t1', 't2', 't3', 't4'],
					maxZoom: 21,
					minZoom: 11
				}).addTo(map);

				const geojsonMarkerOptions = {
					fillColor: 'var(--color-primary)',
					color: 'none',
					weight: 1,
					opacity: 1,
					fillOpacity: 0.5,
					radius: 6
				};
				const verkeersl = L.geoJson(routepunten, {
					pointToLayer: function (feature, latlng) {
						return (
							feature.properties.type === 'verkeersl' &&
							L.circleMarker(latlng, geojsonMarkerOptions)
						);
					}
				}).addTo(map);
				const ongeval = L.geoJson(routepunten, {
					pointToLayer: function (feature, latlng) {
						return (
							feature.properties.type === 'ongeval' &&
							L.circleMarker(latlng, { ...geojsonMarkerOptions, fillColor: 'orange' })
						);
					}
				}).addTo(map);
				const voorrang = L.geoJson(routepunten, {
					pointToLayer: function (feature, latlng) {
						return (
							feature.properties.type === 'voorrang' &&
							L.circleMarker(latlng, { ...geojsonMarkerOptions, fillColor: 'blue' })
						);
					}
				}).addTo(map);

				console.log(verkeersl, ongeval, voorrang);
				await import('leaflet-routing-machine').then(async () => {
					await import('$lib/Control.Geocoder.js');
					const control = L.Routing.control({
						waypoints: [
							L.latLng(startingCoordinates[0], startingCoordinates[1]),
							L.latLng(endingCoordinates[0], endingCoordinates[1])
						],
						addWaypoints: false,
						draggableWaypoints: false,
						geocoder: L.Control.Geocoder.nominatim(),
						routeDragInterval: 400,
						lineOptions: {
							styles: [
								{
									color: 'var(--color-blue)',
									opacity: 1,
									weight: 4
								}
							]
						},
						createMarker: (i, wp) => {
							const totalWaypoints = control.getWaypoints().length;
							if (i === 0) {
								return L.marker(wp.latLng, {
									draggable: false,
									icon: L.icon({
										iconUrl: startpunt,
										iconSize: [28, 28]
									})
								});
							}
							if (i === totalWaypoints - 1) {
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
						const waypoints = control.getWaypoints();
						$route = { ...e.routes[0], waypoints };
					});
					const controlDiv = control.onAdd(map);
					geocoderElement = controlDiv.firstChild;
					document.querySelector('.geocoder').prepend(controlDiv.firstChild);
					document.querySelectorAll('.leaflet-routing-geocoder').forEach((node) => {
						node.childNodes[0].disabled = false;
					});
				});
				map.on('mousemove', (e) => {
					lat = e.latlng.lat.toFixed(6);
					lng = e.latlng.lng.toFixed(6);
				});

				map.on('zoomend', () => {
					zoom = map.getZoom();
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
</script>

<section class="map-content">
	<Sidebar {geocoderElement} />
	<div class="main-content {$expert && !$expertKaart ? 'no-bg' : ''}">
		<Routebalk />
		<div
			bind:this={mapElement}
			class="map"
			style="background-color: {$expert && !$expertKaart ? '#000' : '#ddd'}"
		>
			<Coordinates {zoom} {lat} {lng} />
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
			transition: background-color 0.5s;
		}

		.main-content {
			display: grid;
			grid-template-rows: 8rem 1fr;
		}
	}
</style>
