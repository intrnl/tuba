import { For, Match, Switch } from 'solid-js';

import { createQuery } from '@tanstack/solid-query';

import { request, requestKey } from '~/api/request.ts';
import { type VideoItem } from '~/api/types.ts';
import { getRegion } from '~/globals/preferences.ts';

import CircularProgress from '~/components/CircularProgress.tsx';
import LargeVideoItem, { createLargeVideoKey } from '~/components/LargeVideoItem.tsx';
import VirtualContainer from '~/components/VirtualContainer.tsx';

const IndexPage = () => {
	const query = createQuery({
		queryKey: () => requestKey('trending', { region: getRegion() }),
		queryFn: request<VideoItem[]>,
		staleTime: 60_000,
	});

	return (
		<div class="flex flex-col">
			<div class="sticky top-0 z-10 flex h-13 items-center border-b border-divider bg-background px-4">
				<p class="text-base font-bold leading-5">Trending</p>
			</div>

			<Switch>
				<Match when={query.isLoading}>
					<div class="flex h-13 items-center justify-center">
						<CircularProgress />
					</div>
				</Match>

				<Match when={query.data}>
					{(data) => (
						<For each={data()}>
							{(item) => (
								<VirtualContainer key="large_video" id={createLargeVideoKey(item, true)}>
									<LargeVideoItem item={item} showAge />
								</VirtualContainer>
							)}
						</For>
					)}
				</Match>
			</Switch>
		</div>
	);
};

export default IndexPage;
