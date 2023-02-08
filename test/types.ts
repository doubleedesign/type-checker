export type Artist = {
	mbid?: string;
	name: string;
	genre?: string
}

export type Album = {
	mbid?: string;
	isrc?: string;
	barcode: string;
	title: string;
	artist: string[];
}

export type Venue = {
	name: string;
}
