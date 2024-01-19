export const metersToKilometers = (m) => `${(m / 1000).toFixed(1)} km`;

export const secondsToMinutes = (s) => `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`;
