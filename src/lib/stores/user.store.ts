import type { User } from '@junobuild/core';
import { writable } from 'svelte/store';

export const userStore = writable<User | undefined | null>(undefined);
