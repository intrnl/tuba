/// <reference types='vite/client' />

// shaka-player type declarations doesn't export the shaka namespace for some reason.
declare module 'shaka-player' {
	export = shaka;
}
