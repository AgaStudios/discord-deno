// deno-lint-ignore-file no-explicit-any
import type Client from '../client/Client.ts';
import Channel, { loadChannelFromId } from './Channel.ts';
import Role, { loadRole } from './Role.ts';
import User, { loadUserFromId } from './User.ts';

export default class Manager<T> {
  constructor(public client: Client) {}
  #data: T[] = [];
  add(data: T): void {
    // if exists no add again
    this.has('id', (data as any).id) || (this.#data.push(data));
  }
  has(key: string, value: any): boolean {
    return this.#data.some((element: any) => element[key] === value);
  }
  // deno-lint-ignore require-await
  async get(key: string, value: any): Promise<T | undefined> {
    return this.#data.find((element: any) => element[key] === value);
  }
  async getID(id: string): Promise<T | undefined> {
    return await this.get('id', id);
  }
}
export class UserManager extends Manager<User> {
  async get(key: string, value: any): Promise<User | undefined> {
    const exists = this.has(key, value);
    if (key === 'id' && !exists) this.add(await loadUserFromId(this.client, value));
    return super.get(key, value);
  }
}
export class ChannelManager extends Manager<Channel> {
  async get(key: string, value: any): Promise<Channel | undefined> {
    const exists = this.has(key, value);
    if (key === 'id' && !exists) this.add(await loadChannelFromId(this.client, value));
    return super.get(key, value);
  }
}
export class RoleManager extends Manager<Role> {
  async get(key: string, value: any): Promise<Role | undefined> {
    const exists = this.has(key, value);
    if (key === 'id' && !exists) this.add(await loadRole(this.client, value));
    return super.get(key, value);
  }
}
