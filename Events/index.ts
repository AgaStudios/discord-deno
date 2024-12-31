export { default as READY } from 'discord/Events/READY.ts';
export { default as GUILD_CREATE } from 'discord/Events/GUILD_CREATE.ts';
export { default as MESSAGE_CREATE } from 'discord/Events/MESSAGE_CREATE.ts';
export { default as GUILD_MEMBER_ADD } from 'discord/Events/GUILD_MEMBER_ADD.ts';
export { default as GUILD_MEMBER_REMOVE } from 'discord/Events/GUILD_MEMBER_REMOVE.ts';

import type { MESSAGE_CREATE } from 'discord/Events/MESSAGE_CREATE.ts';
import type { READY } from 'discord/Events/READY.ts';
import type { GUILD_CREATE } from 'discord/Events/GUILD_CREATE.ts';
import type { GUILD_MEMBER_ADD } from 'discord/Events/GUILD_MEMBER_ADD.ts'
import type { GUILD_MEMBER_REMOVE } from "discord/Events/GUILD_MEMBER_REMOVE.ts";

export type Events = MESSAGE_CREATE & READY & GUILD_CREATE & GUILD_MEMBER_ADD&GUILD_MEMBER_REMOVE;
