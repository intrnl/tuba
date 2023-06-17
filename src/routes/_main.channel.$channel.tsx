import { Match, Show, Switch, createContext } from 'solid-js';

import { Title } from '@solidjs/meta';
import { Outlet } from '@solidjs/router';
import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';

import { request, requestKey } from '~/api/request.ts';
import { type Channel } from '~/api/types.ts';

import { useParams } from '~/router.ts';
import * as CompactFormat from '~/utils/intl/compact-format.ts';

import CircularProgress from '~/components/CircularProgress.tsx';
import { TabLink } from '~/components/Tab.tsx';
import button from '~/styles/primitives/button.ts';

export const ChannelLayoutContext = createContext<CreateQueryResult<Channel>>();

const tabsMemo = new WeakMap<Channel['tabs'], Set<string>>();

const hasTab = (channel: Channel, tab: string) => {
	const tabs = channel.tabs;
	let set = tabsMemo.get(tabs);

	if (!set) {
		tabsMemo.set(tabs, (set = new Set(tabs.map((tab) => tab.name))));
	}

	return set.has(tab);
};

const ChannelLayout = () => {
	const params = useParams('/channel/:channel');

	const query = createQuery({
		queryKey: () => requestKey(['channel', params.channel]),
		queryFn: request<Channel>,
	});

	return (
		<div class="flex flex-col">
			<div class="sticky top-0 z-20 flex h-13 items-center border-b border-divider bg-background px-4">
				<p class="text-base font-bold leading-5">{query.data ? query.data.name : 'Channel'}</p>
			</div>

			<Switch>
				<Match when={query.isLoading}>
					<div class="flex h-13 items-center justify-center">
						<CircularProgress />
					</div>
				</Match>

				<Match when={query.data}>
					{(data) => (
						<>
							<Title>{data().name} - Tuba</Title>

							<div class="aspect-banner bg-muted-fg">
								<Show when={data().bannerUrl} keyed>
									{(banner) => <img src={banner} class="h-full w-full object-cover" />}
								</Show>
							</div>

							<div class="flex flex-col p-4">
								<div class="flex items-end gap-2">
									<div class="-mt-8 h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted-fg ring-2 ring-background">
										<Show when={data().avatarUrl} keyed>
											{(avatar) => <img src={avatar} class="h-full w-full" />}
										</Show>
									</div>

									<div class="grow" />

									<button class={button({ color: 'primary' })}>Follow</button>
								</div>

								<div class="mt-3">
									<p class="line-clamp-2 break-words text-xl font-bold">{data().name}</p>
								</div>

								<p class="mt-0.5 text-xs text-muted-fg">
									<span>{CompactFormat.format(data().subscriberCount)} subscribers</span>
								</p>

								<Show when={data().description}>
									{(description) => (
										<p class="mt-3 line-clamp-3 whitespace-pre-wrap break-words text-xs text-muted-fg">
											{description()}
										</p>
									)}
								</Show>
							</div>

							<div class="flex h-13 items-center overflow-x-auto border-b border-divider">
								<TabLink href="/channel/:channel" params={params} end>
									Videos
								</TabLink>

								<Show when={hasTab(data(), 'shorts')}>
									<TabLink href="/channel/:channel/shorts" params={params}>
										Shorts
									</TabLink>
								</Show>

								<Show when={hasTab(data(), 'livestreams')}>
									<TabLink href="/channel/:channel/streams" params={params}>
										Live
									</TabLink>
								</Show>

								<Show when={hasTab(data(), 'playlists')}>
									<TabLink href="/channel/:channel/playlists" params={params}>
										Playlists
									</TabLink>
								</Show>

								<Show when={hasTab(data(), 'channels')}>
									<TabLink href="/channel/:channel/channels" params={params}>
										Channels
									</TabLink>
								</Show>
							</div>

							<ChannelLayoutContext.Provider value={query}>
								<Outlet />
							</ChannelLayoutContext.Provider>
						</>
					)}
				</Match>
			</Switch>
		</div>
	);
};

export default ChannelLayout;
