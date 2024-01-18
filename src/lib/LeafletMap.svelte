<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import kruispunten from '$lib/vlakken.js';
	import routepunten from '$lib/routes.js';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
	import { getBikepathColor } from '$lib/utils/color.js';
	import Coordinates from '$lib/components/Coordinates.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	const startingCoordinates = [52.380957, 4.860238];
	const endingCoordinates = [52.358933, 4.909387];

	let mapElement;
	let map;
	let lat = startingCoordinates[0];
	let lng = startingCoordinates[1];
	let zoom = 14.5;

	onMount(async () => {
		if (browser) {
			await import('leaflet').then(async (leaflet) => {
				const L = leaflet.default;
				map = L.map(mapElement).setView(startingCoordinates, 14.5);
				console.log('Loading Leaflet map.');
				L
					.tileLayer('https://{s}.data.amsterdam.nl/topo_wm_zw/{z}/{x}/{y}.png', {
						attribution: `Topografische ondergrond © Gemeente Amsterdam`,
						subdomains: ['t1', 't2', 't3', 't4'],
						maxZoom: 21,
						minZoom: 11,
					})
					.addTo(map);

				const setColor = (feature) => {

					const fill = getBikepathColor(feature);
					return {
						fillOpacity: '1',
						fillColor: fill,
						color: 'none'
					};
				};

				const icon = L.icon({
					iconUrl:
						"https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
					iconSize: [40, 40]
					});

				const geojsonMarkerOptions = {
					fillColor: 'var(--color-primary)',
					color: 'none',
					weight: 1,
					opacity: 1,
					fillOpacity: 0.5,
					radius: 6
				};
				L.geoJSON(kruispunten, { style: setColor }).addTo(map);
				const verkeersl =  L.geoJson(routepunten, {
					pointToLayer: function (feature, latlng) {
						return feature.properties.type === 'verkeersl' && L.circleMarker(latlng, geojsonMarkerOptions);
					}
				}).addTo(map);
				const ongeval =L.geoJson(routepunten, {
					pointToLayer: function (feature, latlng) {
						return feature.properties.type === 'ongeval' && L.circleMarker(latlng, {...geojsonMarkerOptions,
					fillColor: 'orange',
						});
					}
				}).addTo(map);
				const voorrang = L.geoJson(routepunten, {
					pointToLayer: function (feature, latlng) {
						return feature.properties.type === 'voorrang' && L.circleMarker(latlng, {...geojsonMarkerOptions,
					fillColor: 'blue',
						});
					}
				})
				.addTo(map);

				console.log(verkeersl, ongeval, voorrang);
				await import('leaflet-routing-machine').then(async() => {
					await import('$lib/Control.Geocoder.js')
					const control = L.Routing.control({
						waypoints: [
							L.latLng(startingCoordinates[0], startingCoordinates[1]),
							L.latLng(endingCoordinates[0], endingCoordinates[1] )
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
						createMarker: function(i, wp) {
							return L.marker(wp.latLng, {
								draggable: false,
								icon
							});
						}
					})
					const controlDiv = control.onAdd(map);
					document.querySelector('.geocoder').prepend(controlDiv.firstChild);
					document.querySelectorAll('.leaflet-routing-geocoder').forEach(node => {
						node.childNodes[0].disabled = false
					})
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
	<Sidebar />
	<div bind:this={mapElement} class="map">
		<Coordinates {zoom} {lat} {lng} />
	</div>
</section>

<style lang="scss">
	section.map-content {
		display: grid;
		grid-template-columns: 25rem 1fr;
		height: 100%;

		> .map {
			height: 100%;
		}
	}
</style>
