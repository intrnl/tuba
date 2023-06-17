import { For, Match, Switch, createMemo, useContext } from 'solid-js';

import { createInfiniteQuery } from '@tanstack/solid-query';

import { request, requestKey } from '~/api/request.ts';
import { type ChannelShorts } from '~/api/types.ts';

import CircularProgress from '~/components/CircularProgress.tsx';

import { ChannelLayoutContext } from './_main.channel.$channel.tsx';
import VideoItemShort, { createShortVideoKey } from '~/components/VideoItemShort.tsx';
import VirtualContainer from '~/components/VirtualContainer.tsx';

const ChannelShortsPage = () => {
	const parentQuery = useContext(ChannelLayoutContext)!;

	const tabData = createMemo(() => {
		return parentQuery.data!.tabs.find((tab) => tab.name === 'shorts')?.data;
	});

	const query = createInfiniteQuery({
		queryKey: () => requestKey(['channels', 'tabs'], { data: tabData()! }),
		queryFn: request<ChannelShorts>,
		getNextPageParam: (last) => last.nextpage,
		meta: {
			nextpage: true,
		},
		get enabled() {
			return !!tabData();
		},
	});

	return (
		<>
			<Switch>
				<Match when={!tabData()}>
					<div class="p-4 text-sm text-muted-fg">This channel doesn't have any Shorts.</div>
				</Match>

				<Match when>
					<div class="grid grid-cols-3">
						<For each={query.data?.pages}>
							{(page) =>
								page.content.map((item) => (
									<VirtualContainer key="short_video" id={createShortVideoKey(item, 3)}>
										<VideoItemShort item={item} />
									</VirtualContainer>
								))
							}
						</For>
					</div>
				</Match>
			</Switch>

			<Switch>
				<Match when={query.isInitialLoading || query.isFetchingNextPage}>
					<div class="flex h-13 items-center justify-center">
						<CircularProgress />
					</div>
				</Match>

				<Match when={query.hasNextPage}>
					<button
						onClick={() => query.fetchNextPage()}
						class="flex h-13 items-center justify-center text-sm text-accent hover:bg-hinted disabled:pointer-events-none"
					>
						Show more Shorts
					</button>
				</Match>

				<Match when={tabData() && !query.isInitialLoading}>
					<div class="flex h-13 items-center justify-center">
						<p class="text-sm text-muted-fg">End of list</p>
					</div>
				</Match>
			</Switch>
		</>
	);
};

export default ChannelShortsPage;
