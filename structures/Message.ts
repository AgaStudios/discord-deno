import Client from '../client/Client.ts';
import type { ApplicationRaw } from './Application.ts';
import Attachment, { AttachmentRaw } from './Attachment.ts';
import type { ChannelRaw } from './Channel.ts';
import Channel from './Channel.ts';
import type { EmbedRaw } from './Embed.ts';
import Embed from './Embed.ts';
import type { EmojiRaw } from './Guild.ts';
import type { MemberRaw } from './Member.ts';
import type { MessageComponentsRaw } from './MessageComponents.ts';
import type { RoleRaw, RoleSubscriptionDataRaw } from './Role.ts';
import Role from './Role.ts';
import type { SticketItemRaw, SticketRaw } from './Sticket.ts';
import type { UserRaw } from './User.ts';
import User, { loadUserFromRaw } from './User.ts';

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
  allowed_mentions: MessageAllowedMentionsRaw;
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
  allowedMentions: MessageAllowedMentionsRaw;
  id: string;
  channelId: string;
  content: string;
  timestamp: string;
  editedTimestamp: string | null;
  tts: boolean;
  mentionEveryone: boolean;
  embeds: Embed[] = [];
  author!: User;
  mentions: User[] = [];
  mentionRoles: Role[] = [];
  attachments: Attachment[] = [];
  mentionChannels: Channel[] = [];
  referencedMessage!: Message;
  thread!: Channel;
  reactions?: ReactionRaw[];
  nonce?: number | string;
  pinned: boolean;
  webhookId?: string;
  type: MessageType;
  activity?: MessageActivityRaw;
  application?: ApplicationRaw;
  applicationId?: string;
  flags?: number;
  interaction?: MessageInteractionRaw;
  components?: MessageComponentsRaw[];
  stickerItems?: SticketItemRaw[];
  stickers?: SticketRaw[];
  position?: number;
  roleSubscriptionData?: RoleSubscriptionDataRaw;
  resolved?: ResolvedDataRaw;
  constructor(public client: Client, data: MessageRaw) {
    console.log(data);
    this.allowedMentions = data.allowed_mentions;
    this.id = data.id;
    this.channelId = data.channel_id;
    this.content = data.content;
    this.timestamp = data.timestamp;
    this.editedTimestamp = data.edited_timestamp;
    this.tts = data.tts;
    this.mentionEveryone = data.mention_everyone;
    this.reactions = data.reactions;
    this.nonce = data.nonce;
    this.pinned = data.pinned;
    this.webhookId = data.webhook_id;
    this.type = data.type;
    this.activity = data.activity;
    this.application = data.application;
    this.applicationId = data.application_id;
    this.flags = data.flags;
    this.interaction = data.interaction;
    this.components = data.components;
    this.stickerItems = data.sticker_items;
    this.stickers = data.stickers;
    this.position = data.position;
    this.roleSubscriptionData = data.role_subscription_data;
    this.resolved = data.resolved;
  }
  async reply(message: MessageCreateRaw): Promise<Message> {
    return await this.client.rest.createMessage(
      this.channelId,
      new MessageCreate({
        ...message,
        message_reference: {
          message_id: this.id,
        },
      })
    );
  }
}

export async function loadMessage(
  client: Client,
  data: MessageRaw
): Promise<Message> {
  const message = new Message(client, data);
  message.author = await loadUserFromRaw(client, data.author);
  const max = Math.max(
    data.embeds.length,
    data.mentions.length,
    data.mention_roles.length,
    data.attachments.length
  );
  for (let i = 0; i < max; i++) {
    if (data.embeds[i]) message.embeds.push(new Embed(data.embeds[i]));
    if (data.mentions[i])
      message.mentions.push(await loadUserFromRaw(client, data.mentions[i]));
    if (data.mention_roles[i])
      message.mentionRoles.push(new Role(data.mention_roles[i]));
    if (data.attachments[i]) {
      const attcBlob = await fetch(data.attachments[i].url).then(res =>
        res.blob()
      );
      const attcUint8 = new Uint8Array(await attcBlob.arrayBuffer());
      message.attachments.push(
        new Attachment(data.attachments[i].filename, attcUint8)
      );
    }
  }
  return message;
}

export interface MessageCreateRaw {
  content?: string;
  nonce?: number | string;
  tts?: boolean;
  embeds?: Embed[];
  allowed_mentions?: MessageAllowedMentionsRaw;
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
  embeds: Embed[] = [];
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

  addEmbeds(...embeds: Embed[]) {
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
  toFormData(): FormData {
    const formData = new FormData();
    formData.append('payload_json', this.toBlob());
    for (let i = 0; i < this.attachments.length; i++) {
      this.attachments[i].id = i;
      formData.append(
        `files[${i}]`,
        this.attachments[i].toBlob(),
        this.attachments[i].filename
      );
    }
    return formData;
  }
  toSend():
    | { type: 'multipart/form-data'; body: FormData }
    | { type: 'application/json'; body: string } {
    if (this.attachments.length)
      return { type: 'multipart/form-data', body: this.toFormData() };
    return { type: 'application/json', body: JSON.stringify(this) };
  }
  toJSON() {
    return {
      content: this.content,
      tts: this.tts,
      nonce: this.nonce,
      embeds: this.embeds,
      allowed_mentions: this.allowed_mentions,
      message_reference: this.message_reference,
      components: [],
      sticker_ids: [],
      attachments: this.attachments.map((attachment,i) => ({filename: attachment.filename, id: i})),
      flags: this.flags,
    };
  }
  toBlob() {
    return new Blob([JSON.stringify(this)], { type: 'application/json' });
  }
  static fromMessage(message: Message): MessageCreateRaw {
    return {
      content: message.content,
      tts: message.tts,
      nonce: message.nonce,
      allowed_mentions: message.allowedMentions,
      sticker_ids: message.stickerItems?.map(sticker => sticker.id) ?? [],
      attachments: message.attachments,
    };
  }
}
