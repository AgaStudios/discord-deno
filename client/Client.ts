import { Events } from 'discord/Events/index.ts';
import Manager, { UserManager, GuildManager } from 'discord/structures/Manager.ts';
import type User from 'discord/structures/User.ts';
import { Activity, Presence, Status } from 'discord/Types/Presence.ts';
import Rest from 'discord/client/Rest.ts';
import WebSocketManager from 'discord/client/WebSocketManager.ts';
import type Channel from "discord/structures/Channel.ts";

interface EMap<E> {
	clear(): void;
	delete<K extends keyof E>(key: K): boolean;
	entries<K extends keyof E>(): IterableIterator<[K, E[K]]>;
	forEach<K extends keyof E>(callback: (value: E[K][], key: K, map: EMap<E>) => void, thisArg?: this): void;
	get<K extends keyof E>(key: K): E[K][] | undefined;
	has<K extends keyof E>(key: K): boolean;
	keys<K extends keyof E>(): IterableIterator<K>;
	set<K extends keyof E>(key: K, value: E[K][]): this;
	size: number;
	values<K extends keyof E>(): IterableIterator<E[K][]>;
}

interface IEvents {
	// deno-lint-ignore no-explicit-any
	[key: string]: (...args: any[]) => void;
}

class ChannelManager extends Manager<Channel>{
	override async get<K extends keyof Channel>(key: K, value: NonNullable<Channel[K]>): Promise<Channel | undefined> {
		for(const guild of this.client.guilds.cache)
			if(guild.channels.has(key, value))return await guild.channels.get(key, value);
		return;
	}
	/**
	 * this method throws an error
	 */
	override tryGetIDOrAdd(_id: string, _value: (() => Channel) | (() => Promise<Channel>)): Promise<Channel> {
		throw new Error("Invalid Function in this class");
	}
}

export default class Client<E extends IEvents = Events> {
	#token = '';
	user!: User;
	#events = new Map() as EMap<E>;
	#ws: WebSocketManager;
	#presence: Presence = {
		afk: false,
		since: Date.now(),
		status: Status.ONLINE,
		activities: [],
	};
	rest: Rest;
	users: UserManager;
	channels: ChannelManager;
	guilds: GuildManager;
	constructor(intents = 1) {
		const self = this as unknown as Client;
		this.#ws = new WebSocketManager(self, intents);
		this.users = new UserManager(self);
		this.channels = new ChannelManager(self);
		this.guilds = new GuildManager(self);
		this.rest = new Rest(self);
	}
	get token(): string {
		return this.#token;
	}
	login(token: string): this {
		this.#token = token;
		this.#ws.connect(token);
		return this;
	}
	on<K extends keyof E>(event: K, ...callback: E[K][]): this {
		if (!this.#events.has(event)) this.#events.set(event, []);
		this.#events.get(event)?.push(...callback);
		return this;
	}
	emit<K extends keyof E>(event: K, ...args: Parameters<E[K]>): this {
		if (!this.#events.has(event)) return this;
		this.#events.get(event)?.forEach(callback => {
			callback(...args);
		});
		return this;
	}
	setPresence(presence: Presence): this {
		this.#presence = { ...this.#presence, ...presence, since: Date.now() };
		this.#ws.send({ op: 3, d: this.#presence });
		return this;
	}
	setActivity(activity: Activity): this;
	setActivity(name: string, type?: number): this;
	setActivity(name: string | Activity, type?: number): this {
		if (name instanceof Object) return this.setPresence({ activities: [name] });
		return this.setPresence({ activities: [{ name, type: type ?? 0 }] });
	}
	setStatus(status: Status): this {
		return this.setPresence({ status });
	}
	setAFK(afk: boolean): this {
		return this.setPresence({ afk });
	}
	[Symbol.for("Deno.customInspect")](){
		return `<Client ${this.user.globalName}>`;
	}
}
