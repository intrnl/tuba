import { For, Match, Switch, useContext } from 'solid-js';

import { A, useParams } from '~/router.ts';
import * as CompactFormat from '~/utils/intl/compact-format.ts';
import * as RelTimeFormat from '~/utils/intl/reltime-format.ts';

import CircularProgress from '~/components/CircularProgress.tsx';
import VirtualContainer from '~/components/VirtualContainer.tsx';
import VideoItemLarge, { createLargeVideoKey } from '~/components/VideoItemLarge.tsx';

import { WatchLayoutContext } from './_main.watch.$video.tsx';

const WatchPage = () => {
	const params = useParams('/watch/:video');
	const query = useContext(WatchLayoutContext)!;

	return (
		<>
			<Switch>
				<Match when={query.isLoading}>
					<div class="flex h-13 items-center justify-center">
						<CircularProgress />
					</div>
				</Match>

				<Match when={query.data}>
					{(data) => (
						<>
							<A href="/watch/:video/about" params={params} class="block px-4 pb-2 pt-4">
								<p class="break-words text-lg font-bold">{data().title}</p>
								<p class="mt-0.5 text-xs text-muted-fg">
									<span class="whitespace-nowrap">{CompactFormat.format(data().views, true)} views</span>

									<span> • </span>
									<span class="whitespace-nowrap">{CompactFormat.format(data().likes, true)} likes</span>

									<span> • </span>
									<span class="whitespace-nowrap">
										{RelTimeFormat.formatAbsolute(new Date(data().uploadDate))}
									</span>
								</p>
							</A>

							<A
								href="/channel/:channel"
								params={{ channel: data().uploaderUrl.slice(9) }}
								class="flex items-center gap-3 px-4 pb-4 pt-2"
							>
								<img src={data().uploaderAvatar} class="h-8 w-8 shrink-0 rounded-full object-cover" />

								<span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
									{data().uploader}
								</span>

								<span class="shrink-0 text-xs text-muted-fg">
									{CompactFormat.format(data().uploaderSubscriberCount)}
								</span>
							</A>

							<hr class="border-divider" />

							<div class="px-4 py-3">
								<span class="text-sm">Comments</span>
							</div>

							<hr class="border-divider" />

							<div class="px-4 py-3">
								<span class="text-sm">Up next</span>
							</div>

							<For each={data().relatedStreams}>
								{(item) => {
									const type = item.type;

									if (type === 'stream') {
										return (
											<VirtualContainer key="large_video" id={createLargeVideoKey(item, false)}>
												<VideoItemLarge item={item} />
											</VirtualContainer>
										);
									}

									return null;
								}}
							</For>
						</>
					)}
				</Match>
			</Switch>
		</>
	);
};

export default WatchPage;
