// deno-lint-ignore-file ban-types
import { ChannelManager, UserManager } from "../structures/Manager.ts";
import type User from "../structures/User.ts";
import { Activity, Presence, Status } from '../Types/Precense.ts';
import Rest from "./Rest.ts";
import WebSocketManager from './WebSocketManager.ts';

export default class Client {
  token!: string;
  user!: User;
  #events = new Map<string, Function[]>();
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
  constructor(intents = 1) {
    this.#ws = new WebSocketManager(this, intents);
    this.users = new UserManager(this);
    this.channels = new ChannelManager(this);
    this.rest = new Rest(this);
  }
  login(token: string): this {
    this.token = token;
    this.#ws.connect(token);
    return this;
  }
  on(event: string, ...callback: Function[]): this {
    if (!this.#events.has(event)) this.#events.set(event, []);
    this.#events.get(event)?.push(...callback);
    return this;
  }
  emit(event: string, ...args: any[]): this {
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
}
