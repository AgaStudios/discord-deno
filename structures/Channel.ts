import type Client from '../client/Client.ts';
import Guild from './Guild.ts';
import { ChannelManager } from './Manager.ts';
import { MemberRaw } from './Member.ts';
import { MessageFlags, MessageRaw, MessageType } from './Message.ts';
import type { UserRaw } from './User.ts';

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
  type: ChannelType;
  guild!: Guild;
  constructor(public client: Client, data: ChannelRaw) {
    this.id = data.id;
    this.type = data.type;
  }
}
export type TypeChannelMD = MDChannel;
export type TypeChannel = TextChannel | CategoryChannel | VoiceChannel;
export class CategoryChannel extends Channel {
  guildId: string | undefined;
  name: string | null | undefined;
  position: number | undefined;
  permissionOverwrites: OverwriteRaw[] | undefined;
  nsfw: boolean | undefined;
  channels: ChannelManager;
  constructor(client: Client, data: ChannelRaw) {
    super(client, data);
    this.channels = new ChannelManager(client);
    this.guildId = data.guild_id;
    this.name = data.name;
    this.position = data.position;
    this.permissionOverwrites = data.permission_overwrites;
    this.nsfw = data.nsfw;
  }
  addChannel(
    channel: TypeChannel,
    channelPermission: typeof CHANNEL_PERMISSIONS
  ) {
    if (channel instanceof CategoryChannel) return;
    if (channelPermission !== CHANNEL_PERMISSIONS) return;
    this.channels.add(channel);
    channel.category = this;
  }
}
export class MessagableChannel extends Channel {
  send(content: string) {
    this.client.rest.createMessage(this.id, {
      content,
      type: MessageType.REPLY,
      flags: MessageFlags.EPHEMERAL,
      message_reference: {
        channel_id: '915708885313151038',
        guild_id: '915708884814024826',
        message_id: '1175500123057430530',
      },
    } as unknown as MessageRaw);
  }
}
export class TextChannel extends MessagableChannel {
  guildId: string | undefined;
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
    this.guildId = data.guild_id;
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
export class VoiceChannel extends MessagableChannel {
  guildId: string | undefined;
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
    this.guildId = data.guild_id;
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
export class MDChannel extends Channel {}

function getTypeChannel(type: ChannelType) {
  if (type === ChannelType.GUILD_TEXT) return TextChannel;
  if (type === ChannelType.GUILD_CATEGORY) return CategoryChannel;
  if (type === ChannelType.GUILD_VOICE) return VoiceChannel;
  return Channel;
}

export async function loadChannelFromRaw(
  client: Client,
  data: ChannelRaw
): Promise<Channel> {
  const exists = client.channels.has('id', data.id);
  if (exists) return (await client.channels.get('id', data.id))!;
  const channel = new (getTypeChannel(data.type))(client, data);
  if (channel.type !== ChannelType.GUILD_CATEGORY) client.channels.add(channel);
  return channel;
}
export async function loadChannelFromId(
  client: Client,
  id: string
): Promise<Channel> {
  const exists = client.channels.has('id', id);
  if (exists) return (await client.channels.get('id', id))!;
  const rawChannel = await client.rest.fetchChannel(id);
  return loadChannelFromRaw(client, rawChannel);
}
