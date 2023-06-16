import { For, Match, Switch, useContext } from 'solid-js';

import { createInfiniteQuery } from '@tanstack/solid-query';

import { request, requestKey } from '~/api/request.ts';
import { type ChannelVideos } from '~/api/types.ts';

import { A, useParams } from '~/router.ts';
import * as CompactFormat from '~/utils/intl/compact-format.ts';
import * as RelTimeFormat from '~/utils/intl/reltime-format.ts';
import * as DurationFormat from '~/utils/intl/duration-format.ts';

import { ChannelLayoutContext } from './_main.channel.$channel.tsx';
import CircularProgress from '~/components/CircularProgress.tsx';

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
						page.relatedStreams.map((item) => {
							const videoId = () => item.url.slice(9);

							return (
								<div class="flex gap-3 px-3 pt-4">
									<A
										href="/watch/:video"
										params={{ video: videoId() }}
										class="relative aspect-video shrink-0 basis-2/5"
									>
										<img src={item.thumbnail} class="h-full w-full rounded-md" />

										<span class="absolute bottom-0 right-0 m-1 rounded bg-black/80 px-1 py-px text-xs text-white">
											{DurationFormat.format(item.duration)}
										</span>
									</A>

									<A href="/watch/:video" params={{ video: videoId() }} class="-mt-0.5 grow">
										<p class="line-clamp-3 break-words text-sm">{item.title}</p>
										<p class="mt-0.5 text-xs text-muted-fg">
											<span class="whitespace-nowrap">{CompactFormat.format(item.views)} views</span>

											<span> • </span>
											<span class="whitespace-nowrap">{RelTimeFormat.format(item.uploaded)}</span>
										</p>
									</A>
								</div>
							);
						})
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
