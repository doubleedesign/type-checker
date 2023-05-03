export type MusicCommon = {
	mbid?: string;
}

export type Artist = MusicCommon & {
	name: string;
	genre?: string
}

export type Album = MusicCommon & {
	isrc?: string;
	barcode: string;
	title: string;
	artist: string[];
}

export type Venue = {
	name: string;
}
