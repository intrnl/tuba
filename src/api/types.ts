export interface VideoItem {
	type: 'stream';
	url: string;
	thumbnail: string;
	title: string;
	uploaderAvatar: string | null;
	uploaderName: string;
	uploaderUrl: string;
	uploaderVerified: boolean;
	uploaded: number;
	duration: number;
	views: number;
}

export interface PlaylistItem {
	type: 'playlist';
	playlistType: 'NORMAL';
	url: string;
	thumbnail: string;
	name: string;
	uploaderName: string;
	uploaderUrl: string | null;
	uploaderVerified: boolean;
	videos: number;
}

export interface ChannelItem {
	type: 'channel';
	url: string;
	thumbnail: string;
	name: string;
	verified: boolean;
	subscribers: number;
	videos: number;
}

export interface ChannelTabItem {
	name: 'shorts' | 'livestreams' | 'playlists' | 'channels';
	data: string;
}

export interface ChannelVideos {
	nextpage: string | null;
	relatedStreams: VideoItem[];
}

interface ChannelItems<T> {
	nextpage: string | null;
	content: T[];
}

export type ChannelShorts = ChannelItems<VideoItem>;
export type ChannelPlaylists = ChannelItems<PlaylistItem>;
export type ChannelChannels = ChannelItems<ChannelItem>;

export interface Channel extends ChannelVideos {
	id: string;
	name: string;
	avatarUrl: string;
	bannerUrl: string | null;
	description: string;
	verified: boolean;
	subscriberCount: number;
	tabs: ChannelTabItem[];
}

export interface Stream {
	url: string;
	format: 'M4A' | 'WEBMA_OPUS' | 'MPEG_4' | 'WEBM';
	quality: string;
	mimeType: 'audio/mp4' | 'audio/webm' | 'video/mp4' | 'video/webm';
	codec: 'mp4a.40.5' | 'opus' | 'avc1.640028' | 'vp9';
	audioTrackId: string | null;
	audioTrackName: string | null;
	audioTrackType: string | null;
	audioTrackLocale: string | null;
	videoOnly: false;
	itag: number;
	bitrate: number;
	initStart: number;
	initEnd: number;
	indexStart: number;
	indexEnd: number;
	width: number;
	height: number;
	fps: number;
	contentLength: number;
}

export interface Video {
	title: string;
	description: string;
	uploadDate: string;
	uploader: string;
	uploaderUrl: string;
	uploaderAvatar: string;
	uploaderVerified: boolean;
	uploaderSubscriberCount: number;
	thumbnailUrl: string;
	hls: string | null;
	dash: string | null;
	lbryId: null;
	category: string;
	duration: number;
	views: number;
	likes: number;
	dislikes: number;
	livestream: boolean;
	proxyUrl: string;
	audioStreams: Stream[];
	videoStreams: Stream[];
	relatedStreams: (VideoItem | PlaylistItem)[];
}

export interface Comment {
	author: string;
	thumbnail: string;
	commentId: string;
	commentText: string;
	commentedTime: string;
	commentorUrl: string;
	likeCount: number;
	replyCount: number;
	repliesPage: string | null;
	hearted: boolean;
	pinned: boolean;
	verified: boolean;
}

export interface Comments {
	comments: Comment[];
	disabled: boolean;
	nextpage: string | null;
}
