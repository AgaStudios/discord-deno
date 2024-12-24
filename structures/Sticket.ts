import type { UserRaw } from '@s/User.ts';

export const enum SticketFormatType {
	PNG = 1,
	APNG = 2,
	LOTTIE = 3,
	GIF = 4,
}
export interface SticketItemRaw {
	id: string;
	name: string;
	format_type: SticketFormatType;
}

export const enum SticketType {
	STANDARD = 1,
	GUILD = 2,
}
export interface SticketRaw {
	id: string;
	pack_id?: string;
	name: string;
	description?: string;
	tags?: string;
	asset?: string;
	type: number;
	format_type: SticketFormatType;
	available?: boolean;
	guild_id?: string;
	user?: UserRaw;
	sort_value?: number;
}
