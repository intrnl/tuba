import { Show } from 'solid-js';

import { type VideoItem } from '~/api/types.ts';

import { A } from '~/router.ts';
import * as CompactFormat from '~/utils/intl/compact-format.ts';
import * as RelTimeFormat from '~/utils/intl/reltime-format.ts';
import * as DurationFormat from '~/utils/intl/duration-format.ts';

interface VideoItemLargeProps {
	item: VideoItem;
	showAge?: boolean;
}

export const createLargeVideoKey = (item: VideoItem, showAge: boolean = false) => {
	return `${item.url.slice(9)}:${+showAge}`;
};

const VideoItemLarge = (props: VideoItemLargeProps) => {
	const item = () => props.item;

	const channelId = () => item().uploaderUrl.slice(9);
	const videoId = () => item().url.slice(9);

	return (
		<div>
			<A href="/watch/:video" params={{ video: videoId() }} class="relative">
				<img src={item().thumbnail} class="aspect-video w-full object-cover" />

				<span class="absolute bottom-0 right-0 m-1 rounded bg-black/80 px-1 py-px text-xs text-white">
					{DurationFormat.format(item().duration)}
				</span>
			</A>

			<div class="flex gap-3 px-3 pb-4 pt-3">
				<div class="shrink-0">
					<A href="/channel/:channel" params={{ channel: channelId() }}>
						<img src={item().uploaderAvatar!} class="h-10 w-10 rounded-full" />
					</A>
				</div>

				<A href="/watch/:video" params={{ video: videoId() }} class="min-w-0 grow">
					<p class="line-clamp-2 break-words text-sm font-medium">{item().title}</p>
					<p class="mt-1 text-xs text-muted-fg">
						<span>{item().uploaderName}</span>
						<span> • </span>
						<span class="whitespace-nowrap">{CompactFormat.format(item().views)} views</span>

						<Show when={props.showAge}>
							<span> • </span>
							<span class="whitespace-nowrap">{RelTimeFormat.format(item().uploaded)}</span>
						</Show>
					</p>
				</A>
			</div>
		</div>
	);
};

export default VideoItemLarge;
