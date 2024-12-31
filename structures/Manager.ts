import type Client from 'discord/client/Client.ts';
import Channel, { loadChannelFromId } from 'discord/structures/Channel.ts';
import Role, { loadRole } from 'discord/structures/Role.ts';
import User, { loadUserFromId } from 'discord/structures/User.ts';
import Guild, { loadGuildFromId } from 'discord/structures/Guild.ts';
import Member, { loadMemberFromId } from 'discord/structures/Member.ts';

type GetValueFunction<T> = (() => T) | (() => Promise<T>);

export default class Manager<T extends { id: string }> {
	constructor(protected client: Client) {}
	#data: T[] = [];
	add(data: T): void {
		// if exists no add again
		this.has('id', data.id) || this.#data.push(data);
	}
	has<K extends keyof T>(key: K, value: NonNullable<T[K]>): boolean {
		return this.#data.some((element: T) => element[key] === value);
	}
	async tryGetIDOrAdd(id: string, value: GetValueFunction<T>): Promise<T> {
		const exists = this.has('id', id);
		if (!exists) this.add(await value());
		return (await this.getID(id)) as T;
	}
	// deno-lint-ignore require-await
	async get<K extends keyof T>(key: K, value: NonNullable<T[K]>): Promise<T | undefined> {
		return this.#data.find((element: T) => element[key] === value);
	}
	async getID(id: string): Promise<T | undefined> {
		return await this.get('id', id);
	}
	remove(id: string): T | undefined {
		const index = this.#data.findIndex((element: T) => element.id === id);
		const value = this.#data[index];
		if (index !== -1) this.#data.splice(index, 1);
		return value;
	}
	get size(): number {
		return this.#data.length;
	}
	get cache(): T[] {
		return [...this.#data];
	}
	[Symbol.for('Deno.customInspect')]() {
		return `${this.constructor.name}[${this.size} ${this.size === 1 ? 'item' : 'items'}]`;
	}
}
export class MemberManager extends Manager<Member> {
	me: Member | null = null;
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
