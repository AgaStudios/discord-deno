// deno-lint-ignore-file no-explicit-any
import type Client from '@cl/Client.ts';
import Channel, { loadChannelFromId } from '@s/Channel.ts';
import Role, { loadRole } from '@s/Role.ts';
import User, { loadUserFromId } from '@s/User.ts';
import Guild, { loadGuildFromId } from '@s/Guild.ts';
import { loadMemberFromId, type Member } from '@s/Member.ts';

export default class Manager<T extends { id: string }> {
	constructor(public client: Client) {}
	#data: T[] = [];
	add(data: T): void {
		// if exists no add again
		this.has('id', data.id) || this.#data.push(data);
	}
	has<K extends keyof T>(key: K, value: NonNullable<T[K]>): boolean {
		return this.#data.some((element: any) => element[key] === value);
	}
	// deno-lint-ignore require-await
	async get<K extends keyof T>(key: K, value: NonNullable<T[K]>): Promise<T | undefined> {
		return this.#data.find((element: any) => element[key] === value);
	}
	async getID(id: string): Promise<T | undefined> {
		return await this.get('id', id);
	}
	get size(): number {
		return this.#data.length;
	}
}
export class MemberManager extends Manager<Member> {
	constructor(client: Client, public guild: Guild) {
		super(client);
	}
	override async get<K extends keyof Member>(key: K, value: NonNullable<Member[K]>): Promise<Member | undefined> {
		const exists = this.has(key, value);
		if (key === 'id' && !exists) this.add(await loadMemberFromId(this.client, this.guild, value as string));
		return super.get(key, value);
	}
}
export class UserManager extends Manager<User> {
	override async get<K extends keyof User>(key: K, value: NonNullable<User[K]>): Promise<User | undefined> {
		const exists = this.has(key, value);
		if (key === 'id' && !exists) this.add(await loadUserFromId(this.client, value as string));
		return super.get(key, value);
	}
}
export class ChannelManager extends Manager<Channel> {
	override async get<K extends keyof Channel>(key: K, value: NonNullable<Channel[K]>): Promise<Channel | undefined> {
		const exists = this.has(key, value);
		if (key === 'id' && !exists) this.add(await loadChannelFromId(this.client, value as string));
		return super.get(key, value);
	}
}
export class GuildManager extends Manager<Guild> {
	override async get<K extends keyof Guild>(key: K, value: NonNullable<Guild[K]>): Promise<Guild | undefined> {
		const exists = this.has(key, value);
		if (key === 'id' && !exists) this.add(await loadGuildFromId(this.client, value as string));
		return super.get(key, value);
	}
}
export class RoleManager extends Manager<Role> {
	override async get<K extends keyof Role>(key: K, value: NonNullable<Role[K]>): Promise<Role | undefined> {
		const exists = this.has(key, value);
		if (key === 'id' && !exists) this.add(await loadRole(this.client, value as string));
		return super.get(key, value);
	}
}
