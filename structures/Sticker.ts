import User, { type UserRaw } from 'discord/structures/User.ts';
import Guild, { loadGuildFromId } from 'discord/structures/Guild.ts';
import type Client from 'discord/client/Client.ts';

export const enum StickerFormatType {
	PNG = 1,
	APNG = 2,
	LOTTIE = 3,
	GIF = 4,
}
export interface StickerItemRaw {
	id: string;
	name: string;
	format_type: StickerFormatType;
}

export const enum StickerType {
	STANDARD = 1,
	GUILD = 2,
}
export interface StickerRaw {
	id: string;
	pack_id?: string;
	name: string;
	description?: string;
	tags?: string;
	asset?: string;
	type: number;
	format_type: StickerFormatType;
	available?: boolean;
	guild_id?: string;
	user?: UserRaw;
	sort_value?: number;
}

export default class Sticker {
	id: string;
	name: string;
	type: number;
	format_type: StickerFormatType;
	user: User | null = null;
	guild: Guild | null = null;
	constructor(data: StickerRaw) {
		this.id = data.id;
		this.name = data.name;
		this.type = data.type;
		this.format_type = data.format_type;
	}
}

export async function createStickerFromRaw(client: Client, raw: StickerRaw): Promise<Sticker> {
	const sticker = new Sticker(raw);
	if (raw.user) sticker.user = await client.users.tryGetIDOrAdd(raw.user.id, () => new User(raw.user!));
	if (raw.guild_id)
		sticker.guild = await client.guilds.tryGetIDOrAdd(
			raw.guild_id,
			() => loadGuildFromId(client, raw.guild_id!),
		);
	return sticker;
}
