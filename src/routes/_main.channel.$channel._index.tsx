import { For, Match, Switch, useContext } from 'solid-js';

import { createInfiniteQuery } from '@tanstack/solid-query';

import { request, requestKey } from '~/api/request.ts';
import { type ChannelVideos } from '~/api/types.ts';

import { useParams } from '~/router.ts';

import CircularProgress from '~/components/CircularProgress.tsx';
import VideoItemSmall, { createSmallVideoKey } from '~/components/VideoItemSmall.tsx';
import VirtualContainer from '~/components/VirtualContainer.tsx';

import { ChannelLayoutContext } from './_main.channel.$channel.tsx';

const ChannelVideosPage = () => {
	const parentQuery = useContext(ChannelLayoutContext)!;

	const params = useParams('/channel/:channel');

	const query = createInfiniteQuery({
		queryKey: () => requestKey(['nextpage', 'channel', params.channel]),
		queryFn: (ctx): Promise<ChannelVideos> => {
			if (ctx.pageParam) {
				return request(ctx);
			}

			// @ts-expect-error
			return request({ ...ctx, queryKey: ctx.queryKey.slice(1) });
		},
		getNextPageParam: (last) => last.nextpage,
		initialData: () => {
			const { nextpage, relatedStreams } = parentQuery.data!;

			return {
				pages: [{ nextpage, relatedStreams }],
				pageParams: [undefined],
			};
		},
		refetchOnReconnect: false,
		refetchOnMount: false,
		meta: {
			nextpage: true,
		},
	});

	return (
		<>
			<div class="pb-4">
				<For each={query.data?.pages}>
					{(page) =>
						page.relatedStreams.map((item) => (
							<VirtualContainer key="small_video" id={createSmallVideoKey(item)}>
								<VideoItemSmall item={item} />
							</VirtualContainer>
						))
					}
				</For>
			</div>

			<Switch>
				<Match when={query.isFetchingNextPage}>
					<div class="flex h-13 items-center justify-center">
						<CircularProgress />
					</div>
				</Match>

				<Match when={query.hasNextPage}>
					<button
						onClick={() => query.fetchNextPage()}
						class="flex h-13 items-center justify-center text-sm text-accent hover:bg-hinted disabled:pointer-events-none"
					>
						Show more videos
					</button>
				</Match>

				<Match when={!query.isInitialLoading}>
					<div class="flex h-13 items-center justify-center">
						<p class="text-sm text-muted-fg">End of list</p>
					</div>
				</Match>
			</Switch>
		</>
	);
};

export default ChannelVideosPage;
