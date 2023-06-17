import { Show, createContext, createEffect, createSignal, untrack } from 'solid-js';

import { Title } from '@solidjs/meta';
import { Outlet } from '@solidjs/router';
import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';

import shaka from 'shaka-player';

import { request, requestKey } from '~/api/request.ts';
import { type Video } from '~/api/types.ts';

import { useParams } from '~/router.ts';
import { createDashXml } from '~/utils/dash.ts';

const hasMseSupport = typeof MediaSource !== 'undefined';

export const WatchLayoutContext = createContext<CreateQueryResult<Video>>();

const WatchLayout = () => {
	let videoEl: HTMLVideoElement | undefined;

	const params = useParams('/watch/:video');

	const [player, setPlayer] = createSignal<shaka.Player>();
	const [ready, setReady] = createSignal(false);

	const query = createQuery({
		queryKey: () => requestKey(['streams', params.video]),
		queryFn: request<Video>,
		staleTime: Infinity,
		refetchOnReconnect: false,
		refetchOnMount: false,
	});

	createEffect(() => {
		const data = query.data;

		let instance = untrack(player);
		let uri: string;
		let mime: string | undefined;

		if (!data) {
			setReady(false);

			if (instance) {
				instance.unload();
			}

			return;
		}

		if (data.livestream) {
			uri = data.hls!;
			mime = 'application/x-mpegURL';
		} else if (hasMseSupport && data.audioStreams.length > 0) {
			if (!data.dash) {
				const dash = createDashXml([...data.audioStreams, ...data.videoStreams], data.duration);

				uri = 'data:application/dash+xml;charset=utf-8,' + encodeURIComponent(dash);
			} else {
				const url = new URL(data.dash);
				url.searchParams.set('rewrite', 'false');
				uri = '' + url;
			}

			mime = 'application/dash+xml';
		} else if (data.hls) {
			uri = data.hls;
			mime = 'application/x-mpegURL';
		} else {
			uri = data.videoStreams.filter((stream) => stream.codec == null).slice(-1)[0].url;
		}

		if (!instance) {
			instance = new shaka.Player(videoEl!);
			const proxy = data.proxyUrl.replace(/^[a-z]+:\/\//, '');

			instance.getNetworkingEngine()!.registerRequestFilter((_type, request) => {
				const uri = request.uris[0];
				const headers = request.headers;

				const url = new URL(uri);

				let rewrite = false;

				if (url.host.endsWith('.googlevideo.com')) {
					url.searchParams.set('host', url.host);
					url.host = proxy;

					rewrite = true;
				}

				if (url.pathname === '/videoplayback' && headers.Range) {
					url.searchParams.set('range', headers.Range.split('=')[1]);

					request.headers = {};
					rewrite = true;
				}

				if (rewrite) {
					request.uris[0] = '' + url;
				}
			});

			videoEl!.addEventListener('loadedmetadata', () => {
				setReady(true);
			});

			setPlayer(instance);
		}

		setReady(false);
		instance.load(uri, 0, mime);
	});

	return (
		<div class="flex flex-col">
			<Show when={query.data}>
				{(data) => (
					<>
						<Title>{data().title} - Tuba</Title>
					</>
				)}
			</Show>

			<div class="relative">
				<video ref={videoEl} class="w-full bg-black" controls classList={{ 'aspect-video': !ready() }} />
			</div>

			<WatchLayoutContext.Provider value={query}>
				<Outlet />
			</WatchLayoutContext.Provider>
		</div>
	);
};

export default WatchLayout;
