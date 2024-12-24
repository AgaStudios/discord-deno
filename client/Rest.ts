import { API } from "../constants/Constants.ts";
import type { ChannelRaw } from "../structures/Channel.ts";
import { MessageCreate, MessageRaw, loadMessage } from "../structures/Message.ts";
import type { UserRaw } from "../structures/User.ts";
import type Client from "./Client.ts";

export default class Rest {
  constructor(public client: Client){  }
  async fetchUser(id: string) : Promise<UserRaw> {
    return await fetch(`${API}/users/${id}`, {
      headers: { Authorization: `Bot ${this.client.token}` },
    }).then(res => res.json());
  }
  async fetchChannel(id: string): Promise<ChannelRaw> {
    return await fetch(`${API}/channels/${id}`, {
      headers: { Authorization: `Bot ${this.client.token}` },
    }).then(res => res.json());
  }
  async createMessage(channelId: string, data: MessageCreate) {
    const {type, body} = data.toSend();
    if(type === 'multipart/form-data') {
      body.forEach((value, key) => {
        console.log(key, value)
      })
    }
    const res = await fetch(`${API}/channels/${channelId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bot ${this.client.token}`, 'Content-Type': type },
      body
    });
    const json = await res.json() as MessageRaw;
    return await loadMessage(this.client, json);
  }
  async fetchMessage(channelId: string, messageId: string) {
    const res = await fetch(`${API}/channels/${channelId}/messages/${messageId}`, {
      headers: { Authorization: `Bot ${this.client.token}` },
    });
    const json = await res.json() as MessageRaw;
    return await loadMessage(this.client, json);
  }
  async editMessage(channelId: string, messageId: string, data: MessageCreate) {
    const {type, body} = data.toSend();
    const res = await fetch(`${API}/channels/${channelId}/messages/${messageId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bot ${this.client.token}`, 'Content-Type': type },
      body
    });
    const json = await res.json() as MessageRaw;
    return await loadMessage(this.client, json);
  }
  async deleteMessage(channelId: string, messageId: string) {
    const res = await fetch(`${API}/channels/${channelId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bot ${this.client.token}` },
    });
    return res.ok;
  }
  async fetchMessages(channelId: string, limit = 50) {
    const res = await fetch(`${API}/channels/${channelId}/messages?limit=${limit}`, {
      headers: { Authorization: `Bot ${this.client.token}` },
    });
    const json = await res.json() as MessageRaw[];
    return await Promise.all(json.map(message =>loadMessage(this.client, message)));
  }
  async fetchRole(id: string) {
    const res = await fetch(`${API}/roles/${id}`, {
      headers: { Authorization: `Bot ${this.client.token}` },
    })
    const json = await res.json();
    console.log(json)
    return json;
  }
}