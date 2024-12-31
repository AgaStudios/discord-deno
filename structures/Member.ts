import User, { type UserRaw } from 'discord/structures/User.ts';
import { RoleManager } from 'discord/structures/Manager.ts';
import type Client from 'discord/client/Client.ts';
import type Guild from 'discord/structures/Guild.ts';

export const enum MemberFlags {
	DID_REJOIN = 1 << 0,
	COMPLETED_ONBOARDING = 1 << 1,
	BYPASSES_VERIFICATION = 1 << 2,
	STARTED_ONBOARDING = 1 << 3,
}

export interface MemberRaw {
	user?: UserRaw;
	nick?: string | null;
	guild_id: string;
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
export default class Member {
	readonly id: string;
	readonly user: User;
	#nickname: string | null;
	#avatar: string | null;
	roles: RoleManager;
	constructor(client: Client, member: MemberRaw, public readonly guild: Guild) {
		this.user = new User(member.user!);
		this.id = this.user.id;
		this.#nickname = member.nick ?? null;
		this.#avatar = member.avatar ?? null;
		this.roles = new RoleManager(client);
	}
	get nickname() {
		return this.#nickname;
	}
	get name() {
		return this.#nickname ?? this.user.username ?? this.user.globalName
	}
	setNickname(nickname: string) {
		this.#nickname = nickname;
	}
}

export async function loadMemberFromRaw(client: Client, guild: Guild, raw: MemberRaw): Promise<Member> {
	const member = new Member(client, raw, guild);
	if (raw.roles)
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
