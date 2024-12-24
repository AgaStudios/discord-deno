import User, { type UserRaw } from '@s/User.ts';
import { RoleManager } from "@s/Manager.ts";
import type Client from "@cl/Client.ts";
import type Guild from "@s/Guild.ts";

export const enum MemberFlags {
	DID_REJOIN = 1 << 0,
	COMPLETED_ONBOARDING = 1 << 1,
	BYPASSES_VERIFICATION = 1 << 2,
	STARTED_ONBOARDING = 1 << 3,
}

export interface MemberRaw {
	user?: UserRaw;
	nick?: string | null;
	avatar?: string | null;
	roles: string[];
	joined_at: string;
	premium_since?: string | null;
	deaf: boolean;
	mute: boolean;
	flags?: number;
	pending?: boolean;
	permissions?: string;
	communication_disabled_until?: string | null;
}
export class Member {
	readonly id: string;
	readonly user: User;
	nick: string | null;
	#avatar: string | null;
  roles: RoleManager;
	constructor(client:Client, member: MemberRaw, public readonly guild: Guild) {
		this.user = new User(member.user!);
		this.id = this.user.id;
		this.nick = member.nick ?? null;
		this.#avatar = member.avatar ?? null;
		this.roles = new RoleManager(client);
	}

}

export async function loadMemberFromRaw(client: Client, guild: Guild, raw: MemberRaw): Promise<Member> {
	const member = new Member(client, raw, guild);
	for (const id of raw.roles) {
		const role = await guild.roles.get('id', id);
		if (role) member.roles.add(role);
	}
  return member;
}
export async function loadMemberFromId(client: Client, guild: Guild, id: string): Promise<Member> {
	const data = await client.rest.fetchMember(guild.id, id);
	return loadMemberFromRaw(client, guild, data);
}