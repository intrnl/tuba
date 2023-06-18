import { Match, Switch, useContext } from 'solid-js';

import BodyRenderer from '~/components/BodyRenderer.tsx';
import CircularProgress from '~/components/CircularProgress.tsx';

import { WatchLayoutContext } from './_main.watch.$video.tsx';

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
									<BodyRenderer text={data().description} />
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
