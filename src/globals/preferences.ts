import { ReactiveLocalStorage } from '~/utils/storage.ts';

export type AccountId = string;

export interface Account {
	token: string;
	instanceUrl: string;
}

export interface Preferences {
	counter?: number;
	active?: AccountId;
	accounts?: Record<AccountId, Account>;
	region?: string;
}

const UNAUTHENTICATED = {
	token: undefined,
	instanceUrl: 'https://pipedapi.kavin.rocks',
};

export const preferences = new ReactiveLocalStorage<Preferences>('tuba_prefs');

export const getActiveAccount = () => {
	const active = preferences.get('active');
	const accounts = preferences.get('accounts');

	const account = active && accounts && accounts[active];

	return account || UNAUTHENTICATED;
};

export const getRegion = () => {
	return preferences.get('region') ?? 'JP';
};
