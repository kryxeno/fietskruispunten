import { writable } from 'svelte/store';

export const fietsvriendelijk = writable(true);
export const expert = writable(false);
export const expertKaart = writable(false);

export const expertOptions = writable([
	{
		name: 'Stoplichten',
		type: 'stoplicht',
		state: true
	},
	{
		name: 'Fietswegen',
		type: 'fietsweg',
		state: true
	},
	{
		name: 'Kruispunten',
		type: 'kruispunt',
		state: true
	}
]);

export const punten = writable(null);

export const route = writable(null);
