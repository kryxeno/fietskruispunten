import { writable } from 'svelte/store';

export const fietsvriendelijk = writable(true);
export const expert = writable(false);

export const stoplichten = writable(true);
export const fietswegen = writable(true);
export const kruispunten = writable(true);

export const obstakels = writable([]);
