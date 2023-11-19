import type { ApplicationRaw } from './Application.ts';
import Attachment, { AttachmentRaw } from './Attachment.ts';
import type { ChannelRaw } from './Channel.ts';
import type { EmbedRaw } from "./Embed.ts";
import type { EmojiRaw } from './Guild.ts';
import type { MemberRaw } from './Member.ts';
import type { MessageComponentsRaw } from './MessageComponents.ts';
import type { RoleRaw, RoleSubscriptionDataRaw } from './Role.ts';
import type { SticketItemRaw, SticketRaw } from './Sticket.ts';
import type { UserRaw } from './User.ts';

export interface ChannelMentionRaw {
  id: string;
  guild_id: string;
  type: number;
  name: string;
}

export interface ReactionRaw {
  count: number;
  count_details: {
    burst: number;
    normal: number;
  };
  me: boolean;
  me_burst: boolean;
  emoji: EmojiRaw;
  burst_colors: string[];
}
export const enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  USER_JOIN = 7,
  GUILD_BOOST = 8,
  GUILD_BOOST_TIER_1 = 9,
  GUILD_BOOST_TIER_2 = 10,
  GUILD_BOOST_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  CHAT_INPUT_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22,
  CONTEXT_MENU_COMMAND = 23,
  AUTO_MODERATION_ACTION = 24,
  ROLE_SUBSCRIPTION_PURCHASE = 25,
  INTERACTION_PREMIUM_UPSELL = 26,
  STAGE_START = 27,
  STAGE_END = 28,
  STAGE_SPEAKER = 29,
  STAGE_TOPIC = 31,
  GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
}
export const enum MessageActivityType {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 5,
}
export interface MessageActivityRaw {
  type: MessageActivityType;
  party_id?: string;
}
export interface MessageReferenceRaw {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
  fail_if_not_exists?: boolean;
}
export const enum MessageFlags {
  CROSSPOSTED = 1 << 0,
  IS_CROSSPOST = 1 << 1,
  SUPPRESS_EMBEDS = 1 << 2,
  SOURCE_MESSAGE_DELETED = 1 << 3,
  URGENT = 1 << 4,
  HAS_THREAD = 1 << 5,
  EPHEMERAL = 1 << 6,
  LOADING = 1 << 7,
  FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8,
  SUPPRESS_NOTIFICATIONS = 1 << 12,
  IS_VOICE_MESSAGE = 1 << 13,
}
export const enum MessageInteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
  APPLICATION_COMMAND_AUTOCOMPLETE = 4,
  MODAL_SUBMIT = 5,
}
export interface MessageInteractionRaw {
  id: string;
  type: MessageInteractionType;
  name: string;
  user: UserRaw;
  member?: MemberRaw;
}

export interface ResolvedDataRaw {
  users?: Map<string, UserRaw>;
  members?: Map<string, MemberRaw>;
  roles?: Map<string, RoleRaw>;
  channels?: Map<string, ChannelRaw>;
  messages?: Map<string, MessageRaw>;
  attachments?: Map<string, AttachmentRaw>;
}
export interface MessageRaw {
  id: string;
  channel_id: string;
  author: UserRaw;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: UserRaw[];
  mention_roles: RoleRaw[];
  mention_channels?: ChannelMentionRaw[];
  attachments: AttachmentRaw[];
  embeds: EmbedRaw[];
  reactions?: ReactionRaw[];
  nonce?: number | string;
  pinned: boolean;
  webhook_id?: string;
  type: MessageType;
  activity?: MessageActivityRaw;
  application?: ApplicationRaw;
  application_id?: string;
  message_reference?: MessageReferenceRaw;
  flags?: number;
  referenced_message?: MessageRaw;
  interaction?: MessageInteractionRaw;
  thread?: ChannelRaw;
  components?: MessageComponentsRaw[];
  sticker_items?: SticketItemRaw[];
  stickers?: SticketRaw[];
  position?: number;
  role_subscription_data?: RoleSubscriptionDataRaw;
  resolved?: ResolvedDataRaw;
}
export const enum AllowedMentionsTypes {
  ROLES = 'roles',
  USERS = 'users',
  EVERYONE = 'everyone',
}
export interface MessageAllowedMentionsRaw {
  parse: AllowedMentionsTypes[];
  roles: string[];
  users: string[];
  replied_user: boolean;
}

export default class Message {
  tts = false;
  content: string;
  constructor(data: MessageRaw) {
    this.content = data.content;
  }
}

export interface MessageCreateRaw {
  content?: string;
  nonce?: number | string;
  tts?: boolean;
  embeds?: EmbedRaw[];
  allowed_mentions?: {
    parse: string[];
    roles: string[];
    users: string[];
    replied_user: boolean;
  };
  message_reference?: MessageReferenceRaw;
  components?: MessageComponentsRaw[];
  sticker_ids?: string[];
  attachments?: Attachment[];
  flags?: number;
}
export class MessageCreate {
  content?: string;
  tts: boolean;
  nonce?: string | number;
  embeds: EmbedRaw[] = [];
  allowed_mentions?: {
    parse: string[];
    roles: string[];
    users: string[];
    replied_user: boolean;
  };
  message_reference?: MessageReferenceRaw;
  components: MessageComponentsRaw[] = [];
  sticker_ids: string[] = [];
  attachments: Attachment[] = [];
  flags = 0;
  constructor(data: MessageCreateRaw) {
    this.content = data.content;
    this.tts = data.tts ?? false;
    this.nonce = data.nonce;
    this.message_reference = data.message_reference;
    this.allowed_mentions = data.allowed_mentions;
    this.flags += data.flags ?? 0;

    data.embeds && this.addEmbeds(...data.embeds);
    data.components && this.addComponents(...data.components);
    data.sticker_ids && this.addStickers(...data.sticker_ids);
    data.attachments && this.addAttachments(...data.attachments);
  }

  addEmbeds(...embeds: EmbedRaw[]) {
    this.embeds.push(...embeds);
  }
  addComponents(...components: MessageComponentsRaw[]) {
    this.components.push(...components);
  }
  addStickers(...stickers: string[]) {
    this.sticker_ids.push(...stickers);
  }
  addAttachments(...attachments: Attachment[]) {
    this.attachments.push(...attachments);
  }
}
