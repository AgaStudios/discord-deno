import { Locale } from "discord/Types/Locale.ts";
import Client from "discord/client/Client.ts";

export const enum UserFlags {
	STAFF = 1 << 0,
	PARTNER = 1 << 1,
	HYPESQUAD = 1 << 2,
	BUG_HUNTER_LEVEL_1 = 1 << 3,
	HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
	HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
	HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
	PREMIUM_EARLY_SUPPORTER = 1 << 9,
	TEAM_PSEUDO_USER = 1 << 10,
	BUG_HUNTER_LEVEL_2 = 1 << 14,
	VERIFIED_BOT = 1 << 16,
	VERIFIED_DEVELOPER = 1 << 17,
	CERTIFIED_MODERATOR = 1 << 18,
	BOT_HTTP_INTERACTIONS = 1 << 19,
	ACTIVE_DEVELOPER = 1 << 22,
}
export const enum PremiumType {
	NONE,
	NITRO_CLASSIC,
	NITRO,
	NITRO_BASIC,
}

export interface UserRaw {
	id: string;
	username: string;
	discriminator: string;
	tag: string | null;
	avatar: string | null;
	bot?: boolean;
	system?: boolean;
	mfa_enabled?: boolean;
	banner?: string | null;
	accent_color?: number | null;
	locale?: Locale | null;
	verified?: boolean;
	email?: string | null;
	flags?: number;
	premium_type?: PremiumType;
	public_flags?: number;
	avatar_decoration?: string | null;
}

export default class User {
	id: string;
	username: string;
	discriminator: string;
	globalName: string | null;
	avatar: string | null;
	bot: boolean | undefined;
	system: boolean | undefined;
	mfaEnabled: boolean | undefined;
	banner: string | null | undefined;
	accentColor: number | null | undefined;
	locale: Locale | null | undefined;
	verified: boolean | undefined;
	email: string | null | undefined;
	flags: number | undefined;
	premiumType: PremiumType | undefined;
	publicFlags: number | undefined;
	avatarDecoration: string | null | undefined;
	constructor(data: UserRaw) {
		this.id = data.id;
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.globalName = data.tag;
		this.avatar = data.avatar;
		this.bot = !!data.bot;
		this.system = !!data.system;
		this.mfaEnabled = !!data.mfa_enabled;
		this.banner = data.banner;
		this.accentColor = data.accent_color;
		this.locale = data.locale;
		this.verified = !!data.verified;
		this.email = data.email;
		this.flags = data.flags;
		this.premiumType = data.premium_type;
		this.publicFlags = data.public_flags;
		this.avatarDecoration = data.avatar_decoration;
	}
	getAvatarURL(size = 128): string {
		return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${this.avatar?.startsWith('a_') ? 'gif' : 'png'}?size=${size}`;
	}
	getBannerURL(size = 128): string | null {
		return this.banner ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png?size=${size}` : null;
	}
}

export async function loadUserFromRaw(client: Client, data: UserRaw): Promise<User> {
	const exists = client.users.has('id', data.id);
	if (exists) return (await client.users.get('id', data.id))!;
	const user = new User(data);
	client.users.add(user);
	return user;
}
export async function loadUserFromId(client: Client, id: string): Promise<User> {
	const exists = client.users.has('id', id);
	if (exists) return (await client.users.get('id', id))!;
	const rawUser = await client.rest.fetchUser(id);
	return loadUserFromRaw(client, rawUser);
}
export async function loadUser(client: Client, data: string | UserRaw): Promise<User> {
	if (typeof data === 'string') return await loadUserFromId(client, data);
	return loadUserFromRaw(client, data);
}
