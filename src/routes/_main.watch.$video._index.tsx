import { For, Match, Switch, useContext } from 'solid-js';

import { A } from '~/router.ts';
import * as CompactFormat from '~/utils/intl/compact-format.ts';
import * as RelTimeFormat from '~/utils/intl/reltime-format.ts';
import * as DurationFormat from '~/utils/intl/duration-format.ts';

import VirtualContainer from '~/components/VirtualContainer.tsx';
import LargeVideoItem, { createLargeVideoKey } from '~/components/LargeVideoItem.tsx';

import { WatchLayoutContext } from './_main.watch.$video.tsx';

const WatchPage = () => {
	const query = useContext(WatchLayoutContext)!;

	return (
		<>
			<Switch>
				<Match when={query.data}>
					{(data) => (
						<>
							<div class="flex flex-col gap-4 px-4 py-4">
								<div>
									<p class="break-words text-lg font-bold">{data().title}</p>
									<p class="mt-0.5 text-xs text-muted-fg">
										<span class="whitespace-nowrap">{CompactFormat.format(data().views)} views</span>

										<span> • </span>
										<span class="whitespace-nowrap">{CompactFormat.format(data().likes)} likes</span>

										<span> • </span>
										<span class="whitespace-nowrap">
											{RelTimeFormat.formatAbsolute(new Date(data().uploadDate))}
										</span>
									</p>
								</div>

								<A
									href="/channel/:channel"
									params={{ channel: data().uploaderUrl.slice(9) }}
									class="flex items-center gap-3"
								>
									<img src={data().uploaderAvatar} class="h-8 w-8 shrink-0 rounded-full object-cover" />

									<span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
										{data().uploader}
									</span>

									<span class="shrink-0 text-xs text-muted-fg">
										{CompactFormat.format(data().uploaderSubscriberCount)}
									</span>
								</A>
							</div>

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
												<LargeVideoItem item={item} />
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
