export const getBikepathColor = (feature) => {
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
