import { API } from "../constants/Constants.ts";
import type { ChannelRaw } from "../structures/Channel.ts";
import { MessageRaw } from "../structures/Message.ts";
import type { UserRaw } from "../structures/User.ts";
import type Client from "./Client.ts";

const defaultMessage = {
  tts: false,
  content: '[void message]',
}
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
  async createMessage(channelId: string, message: MessageRaw) {
    const res = await fetch(`${API}/channels/${channelId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bot ${this.client.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...defaultMessage, ...message }),
    });
    const json = await res.json();
    console.log(json);
  }
}