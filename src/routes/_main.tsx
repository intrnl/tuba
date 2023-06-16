import { Show } from 'solid-js';

import { Outlet } from '@solidjs/router';

import { A } from '~/router.ts';
import { useMediaQuery } from '~/utils/media-query.ts';

import SearchIcon from '~/icons/baseline-search.tsx';
import TrendingUpIcon from '~/icons/baseline-trending-up.tsx';
import AccountCircleOutlinedIcon from '~/icons/outline-account-circle.tsx';
import SubscriptionsOutlinedIcon from '~/icons/outline-subscriptions.tsx';
import VideoLibraryOutlinedIcon from '~/icons/outline-video-library.tsx';

const MainLayout = () => {
	const isDesktop = useMediaQuery('(width >= 640px)');

	return (
		<div class="mx-auto flex min-h-screen max-w-7xl flex-col sm:flex-row sm:justify-center">
			<Show when={isDesktop()}>
				<div class="sticky top-0 flex h-screen flex-col items-end xl:basis-1/4">
					<div class="flex grow flex-col gap-2 p-2 lg:p-4 xl:w-64"></div>
				</div>
			</Show>

			<div class="flex min-w-0 max-w-2xl shrink grow flex-col border-divider sm:border-x xl:max-w-none xl:basis-2/4">
				<Outlet />
			</div>

			<div class="hidden basis-1/4 xl:block"></div>

			<Show when={!isDesktop()}>
				<div class="sticky bottom-0 z-30 flex h-13 border-t border-divider bg-background text-primary">
					<A
						href="/"
						title="Trending"
						class="group flex grow basis-0 items-center justify-center text-2xl"
						activeClass="is-active"
						end
					>
						<TrendingUpIcon class="opacity-50 group-[.is-active]:opacity-100" />
					</A>

					<A
						href="/subscriptions"
						title="Search"
						class="group flex grow basis-0 items-center justify-center text-2xl"
						activeClass="is-active"
						end
					>
						<SubscriptionsOutlinedIcon class="opacity-50 group-[.is-active]:opacity-100" />
					</A>

					<A
						href="/search"
						title="Search"
						class="group flex grow basis-0 items-center justify-center text-2xl"
						activeClass="is-active"
						end
					>
						<SearchIcon class="opacity-50 group-[.is-active]:opacity-100" />
					</A>

					<A
						href="/library"
						title="Library"
						class="group flex grow basis-0 items-center justify-center text-2xl"
						activeClass="is-active"
						end
					>
						<VideoLibraryOutlinedIcon class="opacity-50 group-[.is-active]:opacity-100" />
					</A>

					<A
						href="/you"
						title="You"
						class="group flex grow basis-0 items-center justify-center text-2xl"
						activeClass="is-active"
						end
					>
						<AccountCircleOutlinedIcon class="opacity-50 group-[.is-active]:opacity-100" />
					</A>
				</div>
			</Show>
		</div>
	);
};

export default MainLayout;
