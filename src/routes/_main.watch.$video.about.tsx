import { Match, Switch, useContext } from 'solid-js';

import { type SanitizeOptions, DEFAULT_OPTIONS, sanitize } from '@intrnl/dom-sanitize';

import CircularProgress from '~/components/CircularProgress.tsx';

import { WatchLayoutContext } from './_main.watch.$video.tsx';

const sanitizeOptions: SanitizeOptions = {
	...DEFAULT_OPTIONS,
	setAttributes: {
		...DEFAULT_OPTIONS.setAttributes,
		a: {
			...DEFAULT_OPTIONS.setAttributes?.a,
			class: 'text-accent hover:underline',
		},
	},
};

const WatchVideoAboutPage = () => {
	const query = useContext(WatchLayoutContext)!;

	return (
		<>
			<div class="sticky top-0 z-10 flex h-13 items-center border-b border-divider bg-background px-4">
				<p class="text-base font-bold leading-5">Description</p>
			</div>

			<Switch>
				<Match when={query.isLoading}>
					<div class="flex h-13 items-center justify-center">
						<CircularProgress />
					</div>
				</Match>

				<Match when={query.data}>
					{(data) => {
						return (
							<>
								<div class="p-4">
									<p class="break-words text-lg font-bold">{data().title}</p>
								</div>

								<hr class="border-divider" />

								<div class="whitespace-pre-wrap break-words p-4 text-sm">
									{(() => {
										const description = data().description;
										const sanitized = sanitize(description, sanitizeOptions);

										return sanitized;
									})()}
								</div>
							</>
						);
					}}
				</Match>
			</Switch>
		</>
	);
};

export default WatchVideoAboutPage;
