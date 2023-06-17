import { type QueryFunctionContext } from '@tanstack/solid-query';

import { getActiveAccount } from '~/globals/preferences.ts';

export class ResponseError extends Error {
	constructor(public response: Response) {
		super(`Response error ${response.status}`);
	}
}

export type RequestKey = [...paths: string[], params: Record<string, string | undefined> | undefined];

export const requestKey = (
	path: string | string[],
	params?: Record<string, string | undefined>,
): RequestKey => {
	if (Array.isArray(path)) {
		return [...path, params];
	}

	return [path, params];
};

const constructPath = (key: RequestKey) => {
	let params: Record<string, string | undefined> | undefined;
	let str = '';

	for (let idx = 0, len = key.length; idx < len; idx++) {
		const val = key[idx];
		const last = idx === len - 1;

		if (last) {
			// @ts-expect-error
			params = val;
		} else {
			str += '/' + val;
		}
	}

	return [str, params] as const;
};

export const request = async <T = any>(ctx: QueryFunctionContext<RequestKey>): Promise<T> => {
	const meta = ctx.meta;
	const [path, params] = constructPath(ctx.queryKey);

	const { instanceUrl, token } = getActiveAccount();

	const url = new URL(path, instanceUrl);
	const search = url.searchParams;

	for (const key in params) {
		const val = params[key];

		if (val) {
			search.set(key, val);
		}
	}

	if (meta) {
		if (token && meta.auth) {
			search.set('authToken', token);
		}
		if (meta.nextpage) {
			search.set('nextpage', ctx.pageParam);
		}
	}

	const response = await fetch(url, {
		signal: ctx.signal,
	});

	if (!response.ok) {
		throw new ResponseError(response);
	}

	const json = await response.json();
	return json;
};

declare module '@tanstack/query-core' {
	export interface QueryMeta {
		auth?: boolean;
		nextpage?: boolean;
	}
}
