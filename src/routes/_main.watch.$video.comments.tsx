import { For, Match, Show, Switch, createSignal } from 'solid-js';

import { createInfiniteQuery } from '@tanstack/solid-query';

import { request, requestKey, requestNextpage } from '~/api/request.ts';
import { type Comments } from '~/api/types.ts';

import { useParams } from '~/router.ts';

import CircularProgress from '~/components/CircularProgress.tsx';
import CommentItem from '~/components/CommentItem.tsx';
import button from '~/styles/primitives/button.ts';

const WatchVideoCommentsPage = () => {
	const params = useParams('/watch/:video/comments');

	const video = () => params.video;

	const query = createInfiniteQuery({
		queryKey: () => requestKey(['nextpage', 'comments', video()]),
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
						{page.comments.map((item) => (
							<>
								<CommentItem item={item} />

								<Show when={item.repliesPage} keyed>
									{(replyUrl) => {
										const [enabled, setEnabled] = createSignal(false);

										const childQuery = createInfiniteQuery({
											queryKey: () => requestKey(['nextpage', 'comments', video()], { nextpage: replyUrl }),
											queryFn: request<Comments>,
											getNextPageParam: (last) => last.nextpage,
											meta: {
												nextpage: true,
											},
											get enabled() {
												return enabled();
											},
										});

										return (
											<div class="pb-3 pl-16">
												<For each={childQuery.data?.pages}>
													{(page) => page.comments.map((item) => <CommentItem item={item} small />)}
												</For>

												<Switch>
													<Match when={childQuery.isInitialLoading || childQuery.isFetchingNextPage}>
														<div class="flex h-13 items-center justify-center">
															<CircularProgress />
														</div>
													</Match>

													<Match when={!enabled() || childQuery.hasNextPage}>
														<button
															onClick={() => {
																if (enabled()) {
																	childQuery.fetchNextPage();
																} else {
																	setEnabled(true);
																}
															}}
															class={/* @once */ button({ color: 'ghost' })}
														>
															Show more replies
														</button>
													</Match>
												</Switch>
											</div>
										);
									}}
								</Show>

								<hr class="border-divider" />
							</>
						))}
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

				<Match when>
					<div class="flex h-13 items-center justify-center">
						<p class="text-sm text-muted-fg">End of list</p>
					</div>
				</Match>
			</Switch>
		</>
	);
};

export default WatchVideoCommentsPage;
