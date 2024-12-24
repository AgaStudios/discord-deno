import { Locale } from '@t/Locale.ts';
import Channel, { CategoryChannel, ChannelRaw, loadChannelFromRaw } from '@s/Channel.ts';
import { loadMemberFromRaw, Member, MemberRaw } from '@s/Member.ts';
import { RoleRaw } from '@s/Role.ts';
import { UserRaw } from '@s/User.ts';
import type Client from '@cl/Client.ts';
import { ChannelManager, MemberManager, RoleManager } from '@s/Manager.ts';
import Role from '@s/Role.ts';

export interface EmojiRaw {
	id: string;
	name: string;
	roles?: RoleRaw[];
	user?: UserRaw;
	require_colons?: boolean;
	managed?: boolean;
	available?: boolean;
	animated?: boolean;
}
export interface StickerRaw {
	id: string;
	pack_id: string;
	name: string;
	description: string;
	tags: string;
	asset: string;
	preview_asset: string | null;
	format_type: number;
}
export const enum VerificationLevel {
	NONE,
	LOW,
	MEDIUM,
	HIGH,
	VERY_HIGH,
}
export const enum DefaultMessageNotifications {
	ALL_MESSAGES,
	ONLY_MENTIONS,
}
export const enum ExplicitContentFilter {
	DISABLED,
	MEMBERS_WITHOUT_ROLES,
	ALL_MEMBERS,
}
export const enum GuildFeature {
	ANIMATED_BANNER = 'ANIMATED_BANNER',
	ANIMATED_ICON = 'ANIMATED_ICON',
	APPLICATION_COMMAND_PERMISSIONS_V2 = 'APPLICATION_COMMAND_PERMISSIONS_V2',
	AUTO_MODERATION = 'AUTO_MODERATION',
	BANNER = 'BANNER',
	COMMUNITY = 'COMMUNITY',
	CREATOR_MONETIZABLE_PROVISIONAL = 'CREATOR_MONETIZABLE_PROVISIONAL',
	CREATOR_STORE_PAGE = 'CREATOR_STORE_PAGE',
	DEVELOPER_SUPPORT_SERVER = 'DEVELOPER_SUPPORT_SERVER',
	DISCOVERABLE = 'DISCOVERABLE',
	FEATURABLE = 'FEATURABLE',
	INVITES_DISABLED = 'INVITES_DISABLED',
	INVITE_SPLASH = 'INVITE_SPLASH',
	MEMBER_VERIFICATION_GATE_ENABLED = 'MEMBER_VERIFICATION_GATE_ENABLED',
	MORE_STICKERS = 'MORE_STICKERS',
	NEWS = 'NEWS',
	PARTNERED = 'PARTNERED',
	PREVIEW_ENABLED = 'PREVIEW_ENABLED',
	RAID_ALERTS_DISABLED = 'RAID_ALERTS_DISABLED',
	ROLE_ICONS = 'ROLE_ICONS',
	ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE = 'ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE',
	ROLE_SUBSCRIPTIONS_ENABLED = 'ROLE_SUBSCRIPTIONS_ENABLED',
	TICKETED_EVENTS_ENABLED = 'TICKETED_EVENTS_ENABLED',
	VANITY_URL = 'VANITY_URL',
	VERIFIED = 'VERIFIED',
	VIP_REGIONS = 'VIP_REGIONS',
	WELCOME_SCREEN_ENABLED = 'WELCOME_SCREEN_ENABLED',
}
export const enum MFALevel {
	NONE,
	ELEVATED,
}
export const enum SystemChannelFlags {
	SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
	SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
	SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
	SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
	SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
	SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,
}
export const enum PremiumTier {
	NONE,
	TIER_1,
	TIER_2,
	TIER_3,
}
export const enum nsfwLevel {
	DEFAULT,
	EXPLICIT,
	SAFE,
	AGE_RESTRICTED,
}
export interface GuildRaw {
	id: string;
	name: string;
	icon: string | null;
	icon_hash?: string | null;
	splash: string | null;
	discovery_splash: string | null;
	owner?: boolean;
	owner_id: string;
	permissions?: string;
	region: string | null;
	afk_channel_id: string | null;
	afk_timeout: number;
	widget_enabled?: boolean;
	widget_channel_id?: string | null;
	verification_level: VerificationLevel;
	default_message_notifications: DefaultMessageNotifications;
	explicit_content_filter: ExplicitContentFilter;
	roles: RoleRaw[];
	emojis: EmojiRaw[];
	features: GuildFeature[];
	mfa_level: MFALevel;
	application_id: string | null;
	system_channel_id: string | null;
	system_channel_flags: SystemChannelFlags;
	rules_channel_id: string | null;
	max_presences?: number | null;
	max_members?: number;
	vanity_url_code: string | null;
	description: string | null;
	banner: string | null;
	premium_tier: PremiumTier;
	premium_subscription_count?: number;
	preferred_locale: Locale;
	public_updates_channel_id: string | null;
	max_video_channel_users?: number;
	max_stage_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	welcome_screen?: {
		description: string | null;
		welcome_channels: {
			channel_id: string;
			description: string;
			emoji_id: string | null;
			emoji_name: string | null;
		}[];
	};
	nsfw_level: nsfwLevel;
	stickers?: StickerRaw[];
	premium_progress_bar_enabled: boolean;
	safety_alerts_channel_id: string | null;
	instant_invite?: string | null;
	channels: ChannelRaw[];
	members: MemberRaw[];
	presence_count: number;
}

export default class Guild {
	id: string;
	name: string;
	description: string | null;
	#icon: string | null;
	#splash: string | null;
	#discoverySplash: string | null;
	channels: ChannelManager;
	categories: ChannelManager;
	members: MemberManager;
	owner!: Member;
	region: string | null;
	afkChannelId: string | null;
	afkTimeout: number;
	rulesChannelId: string | null;
	roles: RoleManager;
	constructor(client: Client, data: GuildRaw) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.#icon = data.icon;
		this.#splash = data.splash;
		this.#discoverySplash = data.discovery_splash;
		this.channels = new ChannelManager(client);
		this.categories = new ChannelManager(client);
		this.members = new MemberManager(client, this);
		this.roles = new RoleManager(client);
		this.region = data.region;
		this.afkChannelId = data.afk_channel_id;
		this.afkTimeout = data.afk_timeout;
		this.rulesChannelId = data.rules_channel_id;
		/*
    {
      "features": [
        "ANIMATED_ICON",
        "VERIFIED",
        "NEWS",
        "VANITY_URL",
        "DISCOVERABLE",
        "MORE_EMOJI",
        "INVITE_SPLASH",
        "BANNER",
        "COMMUNITY"
      ],
      "emojis": [],
      "banner": "9b6439a7de04f1d26af92f84ac9e1e4a",
      "owner_id": "73193882359173120",
      "application_id": null,
      "region": null,
      "afk_channel_id": null,
      "afk_timeout": 300,
      "system_channel_id": null,
      "widget_enabled": true,
      "widget_channel_id": null,
      "verification_level": 3,
      "default_message_notifications": 1,
      "mfa_level": 1,
      "explicit_content_filter": 2,
      "max_presences": 40000,
      "max_members": 250000,
      "vanity_url_code": "discord-testers",
      "premium_tier": 3,
      "premium_subscription_count": 33,
      "system_channel_flags": 0,
      "preferred_locale": "en-US",
      "rules_channel_id": "441688182833020939",
      "public_updates_channel_id": "281283303326089216",
      "safety_alerts_channel_id": "281283303326089216"
    }*/
	}
	addChannel(channel: Channel) {
		this.channels.add(channel);
		if (channel instanceof CategoryChannel) this.categories.add(channel);
	}
}
export async function loadGuildFromRaw(client: Client, data: GuildRaw): Promise<Guild> {
	const exists = client.guilds.has('id', data.id);
	if (exists) return (await client.guilds.get('id', data.id))!;
	const guild = new Guild(client, data);
	client.guilds.add(guild);

	for (const role of data.roles) guild.roles.add(new Role(role));
	for (const channel of data.channels) guild.addChannel(await loadChannelFromRaw(client, channel));
	for (const member of data.members) guild.members.add(await loadMemberFromRaw(client, guild, member));

	return guild;
}
export async function loadGuildFromId(client: Client, id: string): Promise<Guild> {
	const exists = client.guilds.has('id', id);
	if (exists) return (await client.guilds.get('id', id))!;
	const rawGuild = await client.rest.fetchGuild(id);
	return loadGuildFromRaw(client, rawGuild);
}
