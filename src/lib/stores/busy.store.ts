import { writable, type Readable } from 'svelte/store';

// An app wide busy state

export interface Busy {
	spinner: boolean;
	close: boolean;
}

export interface BusyStore extends Readable<Busy | undefined> {
	start: () => void;
	show: () => void;
	stop: () => void;
}

const initBusyStore = (): BusyStore => {
	const { subscribe, set } = writable<Busy | undefined>(undefined);

	return {
		subscribe,

		start() {
			set({ spinner: true, close: false });
		},

		show() {
			set({ spinner: true, close: true });
		},

		stop() {
			set(undefined);
		}
	};
};

export const busy = initBusyStore();

// A particular busy state used in wizards

export interface BusyWizardStore extends Readable<boolean> {
	start: () => void;
	stop: () => void;
}

const initWizardBusyStore = (): BusyWizardStore => {
	const { subscribe, set } = writable<boolean>(false);

	return {
		subscribe,

		start() {
			set(true);
		},

		stop() {
			set(false);
		}
	};
};

export const wizardBusy = initWizardBusyStore();
