<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import kruispunten from '$lib/vlakken.js';
	import routepunten from '$lib/routes.js';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

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
					.tileLayer('https://{s}.data.amsterdam.nl/topo_wm_zw/{z}/{x}/{y}{r}.png', {
						attribution: `Topografische ondergrond © Gemeente Amsterdam`,
						subdomains: ['t1', 't2', 't3', 't4'],
						maxZoom: 21,
						minZoom: 11,
					})
					.addTo(map);

				// L
				// 	.marker(startingCoordinates)
				// 	.addTo(map)
				// 	.bindPopup('Nederland o Nederland')
				// 	.openPopup();

				const setColor = (feature) => {
					const color = (feature) => {
						switch (feature.properties.Layer) {
							case '100_asfalt_auto_zwart_vlak':
								return '#8c8c8c';
							case '110_asfalt_fiets_zwart_vlak':
								return '#8c8c8c';
							case '120_asfalt_fiets_rood_vlak':
								return '#ed7070';
							case '130_tegelwerk_fiets_rood_vlak':
								return '#ed9393';
							case '200_klinker_rood_vlak':
								return '#eb8b70';
							case '210_tegelwerk_grijs_ vlak':
								return '#c9c9c9';
							case '25_niet_openbaar_wit_vlak':
								return 'none';
							case '300_ovbaan_zwart_vlak':
								return '#8c8c8c';
							case '450_Inritconstructie_grijs_vl':
								return '#c9c9c9';
							case '50_groenvak_vlak':
								return '#9fe6a6';
							case '500_markering_wit_vlak':
								return '#f7f7f7';
							case '800_bomen':
								return '#29b000';
							default:
								return 'none';
						}
					};
					const fill = color(feature);
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
				L.geoJson(routepunten, {
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, geojsonMarkerOptions);
					}
				})
				.addTo(map);
				await import('leaflet-routing-machine').then(() => {
					L.Routing.control({
						waypoints: [
							L.latLng(startingCoordinates[0], startingCoordinates[1]),
							L.latLng(endingCoordinates[0], endingCoordinates[1] )
						],
						routeWhileDragging: true,
						routeDragInterval: 400,
						show: false,
						lineOptions: {
							styles: [
								{
									color: 'var(--color-primary)',
									opacity: 1,
									weight: 4
								}
							]
						},
						createMarker: function(i, wp) {
							return L.marker(wp.latLng, {
								draggable: true,
								icon
							});
						}
					}).addTo(map);

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

<div bind:this={mapElement}></div>
<div class="coordinates">
	<p>{zoom}&nbsp;</p>
	<p>- {lat}</p>
	<p>- {lng}</p>
</div>

<style lang="scss">
	div {
		height: 100%;
	}

	.coordinates {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		height: fit-content;
		background: #fff;
		opacity: 0.7;
		z-index: 1000;
		padding: 0 0.5rem;

		p {
			color: rgb(51, 51, 51);
			font-size: 0.7rem;
			font-weight: 600;
			line-height: 1rem;
			white-space: nowrap;

			&:not(:first-child) {
				width: 4.4rem;
			}

			&:last-child {
				width: 3.6rem;
			}
		}
	}
</style>
