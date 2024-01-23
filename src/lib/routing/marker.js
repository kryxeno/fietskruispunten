import ObstakelIcon from '$lib/components/ObstakelIcon.svelte';
import { fade } from 'svelte/transition';

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
			const container = L.DomUtil.create('div', 'leaflet-marker-container');

			// Create a Svelte component instance
			const obstakelIconComponent = new ObstakelIcon({
				target: container,
				props: {
					type: feature.properties.type,
					stroke: feature.properties.danger
				}
			});

			const iconHtml = container.innerHTML;

			obstakelIconComponent.$destroy();

			const show =
				expertOptions.find((option) => option.type === feature.properties.type).state &&
				(expert || (!expert && feature.properties.danger === 2)) &&
				!feature.properties.rerouted;

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
					console.log(feature.properties);
				});

				markers[markerId] = marker;

				markerLayer.addLayer(marker);
			}

			return marker;
		}
	});
};
