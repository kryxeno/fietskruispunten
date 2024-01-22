export const getRoutePoints = async (points) => {
	const stoplichten = points.filter((point) => point.properties.type === 'verkeersl');
	const voorrang = points.filter((point) => point.properties.type === 'voorrang');
	const ongevallen = points.filter((point) => point.properties.type === 'ongeval');

	return { stoplichten, voorrang, ongevallen };
};

const adjustTable = {
	41024: [4.9087509512901315, 52.36006612971639],
	41023: [4.90851491689682, 52.36032698324903],
	57822: [4.880441576242448, 52.36271881958938],
	50222: [4.877973273396493, 52.366026064272994],
	15822: [4.876457154750825, 52.36826896985506],
	12722: [4.87414374947548, 52.37169288666216],
	13028: [4.875117391347886, 52.37415492943735],
	104: [4.878597557544709, 52.36450534390485],
	125: [4.872269555926324, 52.37480869458895],
	124: [4.870347082614899, 52.37528478672768],
	105: [4.901893883943559, 52.35840842481263]
};

const relatedWaypoints = {
	41028: [141],
	40922: [140],
	52928: [102],
	93124: [120],
	93128: [120],
	12824: [117],
	12820: [117],
	12626: [126],
	15722: [142],
	58924: [3, 109],
	57822: [110],
	52622: [107]
};

const alternativeCoordinates = {
	41024: { coordinates: [4.906436204910279, 52.35797351268496], remove: [41023] },
	41023: { coordinates: [4.911983013153076, 52.36151820845808] },
	105: { coordinates: [4.901930093765259, 52.3573313747126] },
	52622: { coordinates: [4.899357855319978, 52.357115142479046] },
	54122: { coordinates: [4.89193618297577, 52.356725266535776] },
	58922: { coordinates: [4.884463548660279, 52.359110336110476] },
	57822: { coordinates: [4.875719547271729, 52.36220942376238] },
	104: { coordinates: [4.874979257583619, 52.36329044971408], remove: [113, 50222] },
	113: { coordinates: null },
	50222: { coordinates: [4.874056577682496, 52.364626954325175] },
	15822: { coordinates: [4.875075817108155, 52.367620839981136] },
	114: { coordinates: [4.871363639831544, 52.368537963479085] },
	12722: { coordinates: [4.873284101486207, 52.37113856013214] },
	13022: { coordinates: [4.872077107429505, 52.37292679090183], remove: [13028] },
	13028: { coordinates: null },
	125: { coordinates: [4.872516989707948, 52.37366695314816] },
	124: { coordinates: null }
};

export const getWaypointsById = async (ids, points) => {
	if (ids.length === 0 || points.length === 0) return [];

	const waypoints = await ids.map((id) => {
		const wp = points.find((waypoint) => waypoint.properties.id === id);
		if (!wp) return null;
		if (relatedWaypoints[id])
			relatedWaypoints[id].forEach((relatedId) => {
				const relatedWp = points.find((waypoint) => waypoint.properties.id === relatedId);
				if (relatedWp) {
					if (!wp.properties.related) wp.properties.related = [];
					if (wp.properties.related.includes(relatedWp)) return;
					else wp.properties.related.push(relatedWp.properties.id);
				}
			});
		if (adjustTable[id]) {
			wp.geometry.coordinates = adjustTable[id.toString()];
		}
		wp.properties.rerouted = false;
		return wp;
	});
	return waypoints;
};

export const getCoordinatesById = async (ids, points) => {
	const waypoints = await getWaypointsById(ids, points);
	const coordinateArray = waypoints.map((waypoint) =>
		waypoint ? waypoint.geometry.coordinates.reverse() : null
	);
	return coordinateArray;
};
