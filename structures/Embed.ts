export const enum EmbedType {
	RICH = 'rich',
	IMAGE = 'image',
	VIDEO = 'video',
	GIFV = 'gifv',
	ARTICLE = 'article',
	LINK = 'link',
}
export interface EmbedFooterRaw {
	text: string;
	icon_url?: string;
	proxy_icon_url?: string;
}
export interface EmbedImageRaw {
	url: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}
export interface EmbedThumbnailRaw {
	url: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}
export interface EmbedVideoRaw {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}
export interface EmbedProviderRaw {
	name?: string;
	url?: string;
}
export interface EmbedAuthorRaw {
	name: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
}
export interface EmbedFieldRaw {
	name: string;
	value: string;
	inline?: boolean;
}
export interface EmbedRaw {
	title?: string;
	type?: EmbedType;
	description?: string;
	url?: string;
	timestamp?: string;
	color?: number;
	footer?: EmbedFooterRaw;
	image?: EmbedImageRaw;
	thumbnail?: EmbedThumbnailRaw;
	video?: EmbedVideoRaw;
	provider?: EmbedProviderRaw;
	author?: EmbedAuthorRaw;
	fields?: EmbedFieldRaw[];
}

export default class Embed {
	title: string | null = null;
	type: EmbedType = EmbedType.RICH;
	description: string | null = null;
	url: string | null = null;
	timestamp: string | null = null;
	color: number | null = null;
	footer: EmbedFooterRaw | null = null;
	image: EmbedImageRaw | null = null;
	thumbnail: EmbedThumbnailRaw | null = null;
	video: EmbedVideoRaw | null = null;
	provider: EmbedProviderRaw | null = null;
	author: EmbedAuthorRaw | null = null;
	fields: EmbedFieldRaw[] = [];
	constructor(data?: EmbedRaw) {
		if (data) {
			this.type = data.type ?? EmbedType.RICH;
			this.title = data.title ?? null;
			this.description = data.description ?? null;
			this.url = data.url ?? null;
			this.timestamp = data.timestamp ?? null;
			this.color = data.color ?? null;
			this.footer = data.footer ?? null;
			this.image = data.image ?? null;
			this.thumbnail = data.thumbnail ?? null;
			this.video = data.video ?? null;
			this.provider = data.provider ?? null;
			this.author = data.author ?? null;
			data.fields && this.addFields(...data.fields);
		}
	}
	setTitle(title: string) {
		this.title = title;
		return this;
	}
	setDescription(description: string) {
		this.description = description;
		return this;
	}
	setURL(url: string) {
		this.url = url;
		return this;
	}
	setTimestamp(timestamp: string) {
		this.timestamp = timestamp;
		return this;
	}
	setColor(color: number) {
		this.color = color;
		return this;
	}
	setFooter(footer: EmbedFooterRaw) {
		this.footer = footer;
		return this;
	}
	setImage(image: EmbedImageRaw | string) {
		if (typeof image === 'string') image = { url: image };
		this.image = image;
		return this;
	}
	setThumbnail(thumbnail: EmbedThumbnailRaw | string) {
		if (typeof thumbnail === 'string') this.thumbnail = { url: thumbnail };
		else this.thumbnail = thumbnail;
		return this;
	}
	setVideo(video: EmbedVideoRaw) {
		this.video = video;
		return this;
	}
	setProvider(provider: EmbedProviderRaw) {
		this.provider = provider;
		return this;
	}
	setAuthor(author: EmbedAuthorRaw) {
		this.author = author;
		return this;
	}
	setFields(fields: EmbedFieldRaw[]) {
		this.fields = fields;
		return this;
	}
	addFields(...fields: EmbedFieldRaw[]) {
		this.fields?.push(...fields);
		return this;
	}
}
