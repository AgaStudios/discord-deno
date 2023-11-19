import type { EmojiRaw } from "./Guild.ts";

export const enum MessageComponentsType {
  ACTION_ROW = 1,
  BUTTON = 2,
  STRING_SELECT = 3,
  TEXT_INPUT = 4,
  USER_SELECT = 5,
  ROLE_SELECT = 6,
  MENTIONABLE_SELECT = 7,
  CHANNEL_SELECT = 8,
}

export type MessageComponentsRaw = MessageActionRowComponentsRaw | MessageComponentButtonRaw | MessageComponentSelectMenuRaw | MessageComponentTextInputRaw;

export interface MessageActionRowComponentsRaw {
  type: MessageComponentsType.ACTION_ROW;
  components: MessageComponentsRaw[];
}

export const enum MessageComponentButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}
export interface MessageComponentButtonActionRaw {
  type: MessageComponentsType.BUTTON;
  style: Exclude<MessageComponentButtonStyle, MessageComponentButtonStyle.LINK>;
  label?: string;
  emoji?: EmojiRaw;
  custom_id: string;
  url?: string;
  disabled?: boolean;
}
export interface MessageComponentButtonLinkRaw {
  type: MessageComponentsType.BUTTON;
  style: MessageComponentButtonStyle.LINK;
  label?: string;
  emoji?: EmojiRaw;
  custom_id?: string;
  url: string;
  disabled?: boolean;
}
export type MessageComponentButtonRaw = MessageComponentButtonActionRaw | MessageComponentButtonLinkRaw;

export interface MessageComponentSelectOptionRaw {
  label: string;
  value: string;
  description?: string;
  emoji?: EmojiRaw;
  default?: boolean;
}
export interface MessageComponentSelectDefaultValueRaw {
  id: string;
  type: 'user' | 'role' | 'channel';
}
export interface MessageComponentSelectMenuRaw {
  type: MessageComponentsType.STRING_SELECT | MessageComponentsType.USER_SELECT | MessageComponentsType.ROLE_SELECT | MessageComponentsType.MENTIONABLE_SELECT | MessageComponentsType.CHANNEL_SELECT;
  custom_id: string;
  options?: MessageComponentSelectOptionRaw[];
  channel_types?: number[];
  placeholder?: string;
  default_values?: string[];
  min_values?: number;
  max_values?: number;
  disabled?: boolean;
}

export const enum MessageComponentTextInputStyle {
  SINGLE_LINE = 1,
  MULTI_LINE = 2,
}

export interface MessageComponentTextInputRaw {
  type: MessageComponentsType.TEXT_INPUT;
  custom_id: string;
  style: number;
  label: string;
  min_length?: number;
  max_length?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
}