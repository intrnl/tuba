import { type VideoItem } from '~/api/types.ts';

import { A } from '~/router.ts';
import * as CompactFormat from '~/utils/intl/compact-format.ts';
import * as RelTimeFormat from '~/utils/intl/reltime-format.ts';
import * as DurationFormat from '~/utils/intl/duration-format.ts';

export interface VideoItemSmallProps {
	item: VideoItem;
}

export const createSmallVideoKey = (item: VideoItem) => {
	return `${item.url.slice(9)}`;
};

const VideoItemSmall = (props: VideoItemSmallProps) => {
	const item = () => props.item;

	const videoId = () => item().url.slice(9);

	return (
		<div class="flex gap-3 px-3 pt-4">
			<A href="/watch/:video" params={{ video: videoId() }} class="relative aspect-video shrink-0 basis-2/5">
				<img src={item().thumbnail} class="h-full w-full rounded-md" />

				<span class="absolute bottom-0 right-0 m-1 rounded bg-black/80 px-1 py-px text-xs text-white">
					{DurationFormat.format(item().duration)}
				</span>
			</A>

			<A href="/watch/:video" params={{ video: videoId() }} class="-mt-0.5 grow">
				<p class="line-clamp-3 break-words text-sm">{item().title}</p>
				<p class="mt-0.5 text-xs text-muted-fg">
					<span class="whitespace-nowrap">{CompactFormat.format(item().views)} views</span>

					<span> • </span>
					<span class="whitespace-nowrap">{RelTimeFormat.format(item().uploaded)}</span>
				</p>
			</A>
		</div>
	);
};

export default VideoItemSmall;
