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

export const obstakels = writable([
	{
		name: 'Obstakel 1',
		description: `Auto's moeten fietsers voorrang verlenen`,
		type: 'stoplicht',
		afstand: 2200,
		actief: true
	},
	{
		name: 'Obstakel 2',
		description: 'Druk kruispunt',
		type: 'kruispunt',
		afstand: 3000,
		actief: true
	},
	{
		name: 'Obstakel 3 is echt heel lang enzo',
		description: 'Werkzaamheden aan het wegdek, maar als je cool bent dan hoeft het niet.',
		type: 'werkzaamheden',
		afstand: 4800,
		actief: false
	}
]);

export const punten = writable([
	{
		name: 'Punt 1',
		type: 'stoplicht',
		afstand: 500
	},
	{
		name: 'Punt 2',
		type: 'fietsweg',
		afstand: 1300
	},
	{
		name: 'Punt 3',
		type: 'stoplicht',
		afstand: 2200
	},
	{
		name: 'Punt 4',
		type: 'stoplicht',
		afstand: 2600
	},
	{
		name: 'Punt 5',
		type: 'kruispunt',
		afstand: 3000
	},
	{
		name: 'Punt 6',
		type: 'kruispunt',
		afstand: 3500
	},
	{
		name: 'Punt 7',
		type: 'stoplicht',
		afstand: 4300
	},
	{
		name: 'Punt 8',
		type: 'werkzaamheden',
		afstand: 4800
	},
	{
		name: 'Punt 9',
		type: 'stoplicht',
		afstand: 5000
	}
]);

export const route = writable(null);
