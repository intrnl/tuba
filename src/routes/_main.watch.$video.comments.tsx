import { For, Match, Show, Switch } from 'solid-js';

import { createInfiniteQuery } from '@tanstack/solid-query';

import { requestKey, requestNextpage } from '~/api/request.ts';
import { type Comments } from '~/api/types.ts';

import { useParams } from '~/router.ts';

import BodyRenderer from '~/components/BodyRenderer.tsx';
import CircularProgress from '~/components/CircularProgress.tsx';

const WatchVideoCommentsPage = () => {
	const params = useParams('/watch/:video/comments');

	const query = createInfiniteQuery({
		queryKey: () => requestKey(['nextpage', 'comments', params.video]),
		queryFn: requestNextpage<Comments>,
		getNextPageParam: (last) => last.nextpage,
		meta: {
			nextpage: true,
		},
	});

	return (
		<>
			<div class="sticky top-0 z-10 flex h-13 items-center border-b border-divider bg-background px-4">
				<p class="text-base font-bold leading-5">Comments</p>
			</div>

			<For each={query.data?.pages}>
				{(page, idx) => (
					<Show
						when={idx() !== 0 || !page.disabled}
						fallback={<p class="p-4 text-sm">This video has comments disabled.</p>}
					>
						<For each={page.comments}>
							{(item) => {
								return (
									<div class="flex gap-4 border-b border-divider px-4 py-3">
										<div class="shrink-0">
											<img src={item.thumbnail} class="h-12 w-12 rounded-full" />
										</div>
										<div class="min-w-0 grow">
											<div class="mb-0.5 flex items-center text-sm">
												<span class="line-clamp-1 break-all font-medium">{item.author}</span>
											</div>
											<p class="whitespace-pre-wrap break-words text-sm">
												<BodyRenderer text={item.commentText} />
											</p>
										</div>
									</div>
								);
							}}
						</For>
					</Show>
				)}
			</For>

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
						Show more comments
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

export default WatchVideoCommentsPage;
