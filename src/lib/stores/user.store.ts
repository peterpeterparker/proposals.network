import { writable } from 'svelte/store';
import type { UserOption } from '$lib/types/user';

export const userStore = writable<UserOption>(undefined);
