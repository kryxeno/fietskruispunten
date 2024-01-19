import { writable } from 'svelte/store';

export const fietsvriendelijk = writable(true);
export const expert = writable(false);

export const expertOptions = writable([
	{
		icon: null,
		name: 'Stoplichten',
		state: true
	},
	{
		icon: null,
		name: 'Fietswegen',
		state: true
	},
	{
		icon: null,
		name: 'Kruispunten',
		state: true
	}
]);

export const expertKaart = writable(false);

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
		type: 'fietswegen',
		afstand: 3000,
		actief: true
	},
	{
		name: 'Obstakel 3 is echt heel lang enzo',
		description: 'Werkzaamheden aan het wegdek, maar als je cool bent dan hoeft het niet.',
		type: 'kruispunten',
		afstand: 4800,
		actief: false
	}
]);

export const route = writable(null);
