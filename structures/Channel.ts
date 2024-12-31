import type Client from 'discord/client/Client.ts';
import Guild, { loadGuildFromId } from 'discord/structures/Guild.ts';
import { ChannelManager } from 'discord/structures/Manager.ts';
import { MemberRaw } from 'discord/structures/Member.ts';
import { MessageCreate, MessageCreateRaw } from 'discord/structures/Message.ts';
import type { UserRaw } from 'discord/structures/User.ts';

const CHANNEL_PERMISSIONS = {};

export const enum ChannelType {
	GUILD_TEXT = 0,
	DM = 1,
	GUILD_VOICE = 2,
	GROUP_DM = 3,
	GUILD_CATEGORY = 4,
	GUILD_ANNOUNCEMENT = 5,
	ANNOUNCEMENT_THREAD = 10,
	PUBLIC_THREAD = 11,
	PRIVATE_THREAD = 12,
	GUILD_STAGE_VOICE = 13,
	GUILD_DIRECTORY = 14,
	GUILD_FORUM = 15,
	GUILD_MEDIA = 16,
}
export const enum OverwriteType {
	ROLE,
	MEMBER,
}
export interface OverwriteRaw {
	id: string;
	type: OverwriteType;
	allow: string;
	deny: string;
}
export interface VoiceRegionRaw {
	id: string;
	name: string;
	optimal: boolean;
	deprecated: boolean;
	custom: boolean;
}
export const enum VideoQualityMode {
	AUTO = 1,
	FULL = 2,
}
export interface ThreadMetadataRaw {
	archived: boolean;
	auto_archive_duration: number;
	archive_timestamp: string;
	locked: boolean;
	invitable?: boolean;
	create_timestamp?: string;
}
export interface ThreadMemberRaw {
	id?: string;
	user_id?: string;
	join_timestamp: string;
	flags: number;
	member?: MemberRaw;
}
export const enum ChannelFlags {
	PARTNERED = 1 << 0,
	REQUIRE_TAG = 1 << 4,
	HIDE_MEDIA_DOWNLOAD_OPTIONS = 1 << 15,
}
export interface TagRaw {
	id: string;
	name: string;
	moderated: boolean;
	emoji_id: string | null;
	emoji_name: string | null;
}
export interface DefaultReactionRaw {
	emoji_id: string | null;
	emoji_name: string | null;
}
export interface ChannelRaw {
	id: string;
	type: ChannelType;
	guild_id?: string;
	position?: number;
	permission_overwrites?: OverwriteRaw[];
	name?: string | null;
	topic?: string | null;
	nsfw?: boolean;
	last_message_id?: string | null;
	bitrate?: number;
	user_limit?: number;
	rate_limit_per_user?: number;
	recipients?: UserRaw[];
	icon?: string | null;
	owner_id?: string;
	application_id?: string;
	managed?: boolean;
	parent_id?: string | null;
	last_pin_timestamp?: string | null;
	rtc_region?: string | null;
	video_quality_mode?: VideoQualityMode;
	message_count?: number;
	member_count?: number;
	thread_metadata?: ThreadMetadataRaw;
	member?: ThreadMemberRaw;
	default_auto_archive_duration?: number;
	permissions?: string;
	flags?: number;
	total_message_sent?: number;
	available_tags?: TagRaw[];
	applied_tags?: string[];
	default_reaction_emoji?: DefaultReactionRaw | null;
	default_thread_rate_limit_per_user?: number;
	default_sort_order?: number;
	default_forum_layout?: number;
}

export default class Channel {
	id: string;
	type!: ChannelType;
	guild!: Guild;
	constructor(public client: Client, data: ChannelRaw) {
		this.id = data.id;
	}
	isTextBased(): this is MessageChannel {
		return false;
	}
	toString(): string {
		return `<#${this.id}>`;
	}
}
export type TypeChannelDM = DMChannel;
export type TypeChannel = TextChannel | CategoryChannel | VoiceChannel;
export class CategoryChannel extends Channel {
	override type: ChannelType.GUILD_CATEGORY = ChannelType.GUILD_CATEGORY;
	name: string | null | undefined;
	position: number | undefined;
	permissionOverwrites: OverwriteRaw[] | undefined;
	nsfw: boolean | undefined;
	channels: ChannelManager;
	constructor(client: Client, data: ChannelRaw) {
		super(client, data);
		this.channels = new ChannelManager(client);
		this.name = data.name;
		this.position = data.position;
		this.permissionOverwrites = data.permission_overwrites;
		this.nsfw = data.nsfw;
	}
	addChannel(channel: TypeChannel, channelPermission: typeof CHANNEL_PERMISSIONS) {
		if (channel instanceof CategoryChannel) return;
		if (channelPermission !== CHANNEL_PERMISSIONS) return;
		this.channels.add(channel);
		channel.category = this;
	}
}
export abstract class MessageChannel extends Channel {
	send(data: string | MessageCreateRaw) {
		data = typeof data === 'string' ? { content: data } : data;
		this.client.rest.message.createMessage(this.id, new MessageCreate(data));
	}
	override isTextBased(): this is MessageChannel {
		return true;
	}
	async bulkDelete(count: number) {
		const now = Date.now();
		const fourteenDaysAgo = 14 * 24 * 60 * 60 * 1000;
		const messages = await this.client.rest.message.fetchMessagesRaw(this.id, count);
		const validMessages: string[] = [];
		for (const message of messages) {
			if (!message) continue;
			const messageAge = now - Date.parse(message.timestamp);
			if (messageAge <= fourteenDaysAgo) validMessages.push(message.id);
			else break;
		}
		if (validMessages.length === 0 && count > 0) return 0;
		if (validMessages.length === 1) {
			const message = messages.find(msg => msg.id === validMessages[0])!;
			await this.client.rest.message.deleteMessage(message.channel_id, message.id);
			return 1;
		}
		if (validMessages.length > 100 && validMessages.length < 2) throw new Error('Invalid number in range 1 - 100');
		return this.client.rest.message.bulkDeleteMessages(this.id, validMessages);
	}
}
export class TextChannel extends MessageChannel {
	override type: ChannelType.GUILD_TEXT = ChannelType.GUILD_TEXT;
	name: string | null | undefined;
	position: number | undefined;
	permissionOverwrites: OverwriteRaw[] | undefined;
	topic: string | null | undefined;
	nsfw: boolean | undefined;
	lastMessageId: string | null | undefined;
	parentId: string | null | undefined;
	defaultAutoArchiveDuration: number | undefined;
	category!: CategoryChannel;
	constructor(client: Client, data: ChannelRaw) {
		super(client, data);
		this.name = data.name;
		this.position = data.position;
		this.permissionOverwrites = data.permission_overwrites;
		this.topic = data.topic;
		this.nsfw = data.nsfw;
		this.lastMessageId = data.last_message_id;
		this.parentId = data.parent_id;
		this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
	}
}
export class VoiceChannel extends MessageChannel {
	override type: ChannelType.GUILD_VOICE = ChannelType.GUILD_VOICE;
	name: string | null | undefined;
	position: number | undefined;
	permissionOverwrites: OverwriteRaw[] | undefined;
	nsfw: boolean | undefined;
	lastMessageId: string | null | undefined;
	parentId: string | null | undefined;
	bitrate: number | undefined;
	userLimit: number | undefined;
	rtcRegion: string | null | undefined;
	rateLimitPerUser: number | undefined;
	category!: CategoryChannel;
	constructor(client: Client, data: ChannelRaw) {
		super(client, data);
		this.name = data.name;
		this.position = data.position;
		this.permissionOverwrites = data.permission_overwrites;
		this.nsfw = data.nsfw;
		this.lastMessageId = data.last_message_id;
		this.parentId = data.parent_id;
		this.bitrate = data.bitrate;
		this.userLimit = data.user_limit;
		this.rtcRegion = data.rtc_region;
		this.rateLimitPerUser = data.rate_limit_per_user;
	}
}
export class DMChannel extends MessageChannel {
	override type: ChannelType.DM = ChannelType.DM;
}

type ChannelData = VoiceChannel | TextChannel | CategoryChannel | DMChannel;

function getTypeChannel(type: ChannelType) {
	if (type === ChannelType.GUILD_TEXT) return TextChannel;
	if (type === ChannelType.DM) return DMChannel;
	if (type === ChannelType.GUILD_VOICE) return VoiceChannel;
	if (type === ChannelType.GUILD_CATEGORY) return CategoryChannel;
	return Channel;
}

export async function loadChannelFromRaw(client: Client, data: ChannelRaw): Promise<ChannelData> {
	const exists = client.channels.has('id', data.id);
	if (exists) return ((await client.channels.get('id', data.id)) as ChannelData)!;
	const channel = new (getTypeChannel(data.type))(client, data) as unknown as ChannelData;
	channel.guild = await loadGuildFromId(client, data.guild_id ?? '@me');
	if (channel.type !== ChannelType.GUILD_CATEGORY) client.channels.add(channel);
	if (channel.type !== ChannelType.DM && channel.type !== ChannelType.GUILD_CATEGORY) {
		const category = await client.channels.get('id', data.parent_id!);
		if (category instanceof CategoryChannel) category.addChannel(channel, CHANNEL_PERMISSIONS);
	}
	return channel;
}
export async function loadChannelFromId(client: Client, id: string): Promise<ChannelData> {
	const exists = client.channels.has('id', id);
	if (exists) return ((await client.channels.get('id', id)) as ChannelData)!;
	const rawChannel = await client.rest.fetchChannel(id);
	return loadChannelFromRaw(client, rawChannel);
}
