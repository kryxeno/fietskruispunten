export const getRoutePoints = async (points) => {
	const stoplicht = points.filter((point) => point.properties.type === 'stoplicht');
	const kruispunt = points.filter((point) => point.properties.type === 'kruispunt');

	return { stoplicht, kruispunt };
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
	41024: { coordinates: [52.35797351268496, 4.906436204910279], remove: [41023] },
	41023: { coordinates: null },
	105: { coordinates: [52.3573313747126, 4.901930093765259] },
	52622: { coordinates: [52.357115142479046, 4.899357855319978] },
	54122: { coordinates: [52.356725266535776, 4.89193618297577] },
	58922: { coordinates: [52.359110336110476, 4.884463548660279] },
	57822: { coordinates: [52.36220942376238, 4.875719547271729] },
	104: { coordinates: [52.36329044971408, 4.874979257583619], remove: [113, 50222] },
	113: { coordinates: null },
	50222: { coordinates: [52.364626954325175, 4.874056577682496] },
	15822: { coordinates: [52.367620839981136, 4.875075817108155] },
	114: { coordinates: [52.368537963479085, 4.871363639831544] },
	12722: { coordinates: [52.37113856013214, 4.873284101486207] },
	13022: { coordinates: [52.37292679090183, 4.872077107429505], remove: [13028] },
	13028: { coordinates: null },
	125: { coordinates: [52.37366695314816, 4.872516989707948] },
	124: { coordinates: null }
};

const calculateDanger = (waypoint, points) => {
	// returns 0, 1, or 2 depending on the danger or waiting time
	const gevaarlijk = 30;
	const gemiddeld = 15;
	if (waypoint.properties.type === 'stoplicht') {
		// console.log(waypoint.properties);

		waypoint.properties.related?.forEach((wp) => {
			const relatedWp = points.find((waypoint) => waypoint.properties.id === wp);
			waypoint.properties['#ongeval'] += relatedWp.properties['#ongeval'] ?? 0;
			waypoint.properties.gewonden += relatedWp.properties.gewonden ?? 0;
			waypoint.properties.deelconfli += relatedWp.properties.deelconfli ?? 0;
		});
		const {
			deelconfli: deelconflict,
			'doorrijd%': roodRijders,
			'#ongeval': ongevallen,
			gewonden
		} = waypoint.properties;

		const deelconflictScore =
			(deelconflict / 2) * 25 +
			(roodRijders / 100) * 25 +
			(ongevallen / 6) * 40 +
			(gewonden / 3) * 10;

		// console.log(deelconflictScore, { deelconflict, roodRijders, ongevallen, gewonden });

		if (deelconflictScore >= gevaarlijk) return 2;
		if (deelconflictScore >= gemiddeld) return 1;
		return 0;
	} else if (waypoint.properties.type === 'kruispunt') {
		const { deelconfli: deelconflict, '#ongeval': ongevallen, gewonden } = waypoint.properties;

		const deelconflictScore = (deelconflict / 2) * 30 + (ongevallen / 6) * 50 + (gewonden / 3) * 20;

		if (deelconflictScore >= gevaarlijk) return 2;
		if (deelconflictScore >= gemiddeld) return 1;
		return 0;
	} else if (waypoint.properties.type === 'werkzaamheden') {
		return 1;
	}
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
					if (wp.properties.related.includes(relatedWp.properties.id)) return;
					else wp.properties.related.push(relatedWp.properties.id);
				}
			});
		if (adjustTable[id]) {
			wp.geometry.coordinates = adjustTable[id.toString()];
		}
		if (alternativeCoordinates[id].coordinates) wp.properties.canReroute = true;
		else wp.properties.canReroute = false;
		wp.properties.rerouted = false;
		wp.properties.danger = calculateDanger(wp, points);

		return wp;
	});
	console.log(waypoints);
	return waypoints;
};

export const getCoordinatesById = async (ids, points) => {
	const waypoints = await getWaypointsById(ids, points);
	const coordinateArray = waypoints.map((waypoint) =>
		waypoint ? waypoint.geometry.coordinates.reverse() : null
	);
	return coordinateArray;
};

export const updateCoordinatesByWaypoints = async (waypoints) => {
	const coordinateArray = waypoints.map((waypoint) => {
		if (waypoint.properties.rerouted && waypoint.properties.canReroute) {
			if (alternativeCoordinates[waypoint.properties.id].remove) {
				alternativeCoordinates[waypoint.properties.id].remove.forEach((id) => {
					const wp = waypoints.find((waypoint) => waypoint.properties.id === id);
					wp.properties.rerouted = false;
				});
			}
			return alternativeCoordinates[waypoint.properties.id].coordinates;
		} else return waypoint.geometry.coordinates;
	});
	return coordinateArray;
};
