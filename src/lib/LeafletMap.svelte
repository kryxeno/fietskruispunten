<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import kruispunten from '$lib/vlakken.js';
	import routepunten from '$lib/routes.js';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
	import vertrek from '$lib/images/vertrek.svg';
	import bestemming from '$lib/images/bestemming.svg';
	import Switch from '$lib/components/switch.svelte';
	import BaseButton from '$lib/components/basebutton.svelte';
	import { fietsvriendelijk } from '$lib/stores.js';

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
						routeWhileDragging: true,
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
								draggable: true,
								icon
							});
						}
					})
					control._map = map;
					const controlDiv = control.onAdd(map);
					document.querySelector('.geocoder').prepend(controlDiv.firstChild);
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
	<section class="sidebar">
		<div class="container">
			<h2>Plan je fietsroute</h2>
		</div>
		<hr/>
		<div class="container">
			<div class="inputs">
				<div class="icons">
					<div class="circle start">
						<img src={vertrek} alt="starting point" />
					</div>
					<div />
					<div class="circle end">
						<img src={bestemming} alt="ending point" />
					</div>
				</div>
				<div class="geocoder">
					<input
						type="datetime-local"
						id="datePicker"
						value={new Date().toISOString().slice(0, 16)}
					/>
				</div>
			</div>
		</div>
		<hr/>
		<div class="container half">
			<Switch label='Fietsvriendelijk' checked={fietsvriendelijk} defaultChecked={true} />
		</div>
		<hr/>
		<div class="container">
			<BaseButton fill={true} label={'Berekenen'} on:click={() => console.log($fietsvriendelijk, 'kaas')}/>
		</div>
	</section>
	<div bind:this={mapElement} class="map">
		<div class="coordinates">
			<p>{zoom}&nbsp;</p>
			<p>- {lat}</p>
			<p>- {lng}</p>
		</div>
	</div>

</section>


<style lang="scss">
	@import '$lib/leaflet-style.css';
	section.map-content {
		display: grid;
		grid-template-columns: 25rem 1fr;
		height: 100%;

		.sidebar {
			display: flex;
			flex-direction: column;
			padding: 1rem;
			z-index: 1000;
			gap: 1rem;
			overflow: hidden;

			.container {
				padding: 1rem 1rem;

				&.half {
					padding: 0.5rem 1rem;
				}
			}

			.inputs {
				display: flex;

				.icons {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 0.5rem 1rem 0.5rem 0;

					div {
						height: 1.4rem;
						border-right: 2px solid var(--color-grey);
						width: 2px;
					}
					.circle {
						display: flex;
						justify-content: center;
						align-items: center;
						overflow: hidden;
						width: 1.75rem;
						height: 1.75rem;
						border-radius: 50%;
						background: var(--color-grey);

						img {
							translate: 1px 0;
						}
					}
				}

				.geocoder {
					display: flex;
					flex-direction: column;
					gap: 0.6rem;

					input {
						border: 1px solid var(--color-grey);
						padding: 0.5rem 1rem;
					}
				}
			}
		}

		> .map {
			height: 100%;
		}
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
