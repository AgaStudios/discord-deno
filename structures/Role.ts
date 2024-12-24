import Client from "../client/Client.ts";

export interface RoleTagsRaw {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber?: null;
  subscription_listing_id?: string;
  available_for_purchase?: null;
  guild_connections?: null;
}
export const enum RoleFlag {
  IN_PROMPT = 1 << 0,
}
export interface RoleRaw {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTagsRaw;
  flags?: number;
}

export default class Role {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon: string|null|undefined;
  unicodeEmoji: string|null|undefined;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags: RoleTagsRaw|undefined;
  flags: number|undefined;
  constructor(data: RoleRaw) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.icon = data.icon;
    this.unicodeEmoji = data.unicode_emoji;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.mentionable = data.mentionable;
    this.tags = data.tags;
    this.flags = data.flags;
  }
  toString(){
    return `<&${this.name}>`
  }
}

export async function loadRole(client: Client, id: string): Promise<Role> {
  const data = await client.rest.fetchRole(id);
  return new Role(data);
}

export interface RoleSubscriptionDataRaw {
  role_subscription_listing_id: string;
  tier_name: string;
  total_months_subscribed: number;
  is_renewal: boolean;
}