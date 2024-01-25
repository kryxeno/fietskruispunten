import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
import { activePoint, expert as expertState } from '$lib/stores.js';

let markerLayer = null;
let markers = {}; // Object to store markers with their unique identifier

export const updateMarkers = (L, map, punten, expertOptions, expert) => {
	// Create a layer group if it doesn't exist
	if (!markerLayer) {
		markerLayer = L.layerGroup().addTo(map);
	}

	// Iterate through the data and add/update markers
	L.geoJson(punten, {
		pointToLayer: (feature, latlng) => {
			const show =
				(expert && expertOptions.find((option) => option.type === feature.properties.type).state) ||
				(!expert && feature.properties.danger === 2);
			const isDisabled = !feature.properties.rerouted;

			const container = L.DomUtil.create('div', 'leaflet-marker-container');

			const obstakelIconComponent = new ObstakelIcon({
				target: container,
				props: {
					type: feature.properties.type,
					stroke: isDisabled ? feature.properties.danger : 'var(--color-grey)'
				}
			});
			const iconHtml = container.innerHTML;

			obstakelIconComponent.$destroy();

			const html = L.divIcon({
				html: show ? iconHtml : '',
				className: 'route-marker'
			});

			const markerId = feature.properties.id;
			let marker = markers[markerId];

			if (marker) {
				marker.setIcon(html);
			} else {
				marker = L.marker(latlng, {
					icon: html
				});

				marker.on('click', () => {
					const unsubscribe = expertState.subscribe((value) => {
						value && activePoint.set(feature.properties.id);
					});
					unsubscribe();
				});

				marker.on('mouseover', () => {
					const unsubscribe = expertState.subscribe((value) => {
						show && !value && activePoint.set(feature.properties.id);
					});
					unsubscribe();
				});

				markers[markerId] = marker;

				markerLayer.addLayer(marker);
			}

			return marker;
		}
	});
};
