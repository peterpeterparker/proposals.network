import type { Readable } from 'svelte/store';

export interface Store<T, D> extends Readable<T> {
	set: (data: D) => void;
	reset: () => void;
}
