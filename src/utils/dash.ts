import { type Stream } from '~/api/types';

import { type ElementNode, writeXml } from './js2xml.ts';

interface StreamGroup {
	mime: string;
	track: string | null;
	streams: Stream[];
}

export const createDashXml = (streams: Stream[], duration: number): string => {
	const result = createDashManifest(streams, duration);

	return writeXml({
		type: 'root',
		attributes: {
			version: '1.0',
			encoding: 'utf-8',
		},
		elements: [result],
	});
};

export const createDashManifest = (streams: Stream[], duration: number): ElementNode => {
	const groupedStreams: StreamGroup[] = [];

	loop: for (let i = 0, ilen = streams.length; i < ilen; i++) {
		const stream = streams[i];

		const mime = stream.mimeType;
		const track = stream.audioTrackId;

		// the dual formats should not be used
		if ((mime.startsWith('video/') && !stream.videoOnly) || mime.startsWith('application/')) {
			continue;
		}

		for (let j = 0, jlen = groupedStreams.length; j < jlen; j++) {
			const group = groupedStreams[j];

			if (group.mime === mime && group.track === track) {
				group.streams.push(stream);
				continue loop;
			}
		}

		groupedStreams.push({ mime, track, streams: [stream] });
	}

	return {
		type: 'element',
		name: 'MPD',
		attributes: {
			xmlns: 'urn:mpeg:dash:schema:mpd:2011',
			profiles: 'urn:mpeg:dash:profile:full:2011',
			minBufferTime: 'PT1.5S',
			type: 'static',
			mediaPresentationDuration: `PT${duration}S`,
		},
		elements: [
			{
				type: 'element',
				name: 'Period',
				attributes: null,
				elements: groupedStreams.map((group): ElementNode => {
					const isVideo = group.mime.startsWith('video/');

					return {
						type: 'element',
						name: 'AdaptationSet',
						attributes: {
							id: group.track,
							lang: group.track?.slice(0, 2),
							mimeType: group.mime,
							startWithSAP: '1',
							subsegmentAlignment: 'true',
							scanType: isVideo ? 'progressive' : undefined,
						},
						elements: group.streams.map((stream) => {
							return (isVideo ? createVideoRepresentation : createAudioRepresentation)(stream);
						}),
					};
				}),
			},
		],
	};
};

const createAudioRepresentation = (stream: Stream): ElementNode => {
	return {
		type: 'element',
		name: 'Representation',
		attributes: {
			id: stream.itag,
			codecs: stream.codec,
			bandwidth: stream.bitrate,
		},
		elements: [
			{
				type: 'element',
				name: 'AudioChannelConfiguration',
				attributes: {
					schemeIdUri: 'urn:mpeg:dash:23003:3:audio_channel_configuration:2011',
					value: '2',
				},
				elements: null,
			},
			{
				type: 'element',
				name: 'BaseURL',
				attributes: null,
				elements: [
					{
						type: 'text',
						value: stream.url,
					},
				],
			},
			{
				type: 'element',
				name: 'SegmentBase',
				attributes: {
					indexRange: `${stream.indexStart}-${stream.indexEnd}`,
				},
				elements: [
					{
						type: 'element',
						name: 'Initialization',
						attributes: {
							range: `${stream.initStart}-${stream.initEnd}`,
						},
						elements: null,
					},
				],
			},
		],
	};
};

const createVideoRepresentation = (stream: Stream): ElementNode => {
	return {
		type: 'element',
		name: 'Representation',
		attributes: {
			id: stream.itag,
			codecs: stream.codec,
			bandwidth: stream.bitrate,
			width: stream.width,
			height: stream.height,
			maxPlayoutRate: '1',
			frameRate: stream.fps,
		},
		elements: [
			{
				type: 'element',
				name: 'BaseURL',
				attributes: null,
				elements: [
					{
						type: 'text',
						value: stream.url,
					},
				],
			},
			{
				type: 'element',
				name: 'SegmentBase',
				attributes: {
					indexRange: `${stream.indexStart}-${stream.indexEnd}`,
				},
				elements: [
					{
						type: 'element',
						name: 'Initialization',
						attributes: {
							range: `${stream.initStart}-${stream.initEnd}`,
						},
						elements: null,
					},
				],
			},
		],
	};
};
