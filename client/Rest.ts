import { API } from 'discord/constants/Constants.ts';
import type { ChannelRaw } from 'discord/structures/Channel.ts';
import { MessageCreate, MessageRaw, loadMessage } from 'discord/structures/Message.ts';
import type { UserRaw } from 'discord/structures/User.ts';
import type Client from 'discord/client/Client.ts';
import type { GuildRaw } from 'discord/structures/Guild.ts';
import type { MemberRaw } from 'discord/structures/Member.ts';

interface RestHeaders {
	Authorization: string;
	'Content-Type'?: string;
}

class RestMessage {
	constructor(private client: Client) {}
	async createMessage(channelId: string, data: MessageCreate) {
		const { type, body } = data.toSend();
		const headers: RestHeaders = { Authorization: `Bot ${this.client.token}` };
		if (type === 'application/json') headers['Content-Type'] = type;

		const res = await fetch(`${API}/channels/${channelId}/messages`, {
			method: 'POST',
			headers: headers as unknown as HeadersInit,
			body,
		});
		const json = (await res.json()) as MessageRaw;
		return await loadMessage(this.client, json);
	}
	async fetchMessage(channelId: string, messageId: string) {
		const res = await fetch(`${API}/channels/${channelId}/messages/${messageId}`, {
			headers: { Authorization: `Bot ${this.client.token}` },
		});
		const json = (await res.json()) as MessageRaw;
		return await loadMessage(this.client, json);
	}
	async editMessage(channelId: string, messageId: string, data: MessageCreate) {
		const { type, body } = data.toSend();
		const headers: RestHeaders = { Authorization: `Bot ${this.client.token}` };
		if (type === 'application/json') headers['Content-Type'] = type;
		const res = await fetch(`${API}/channels/${channelId}/messages/${messageId}`, {
			method: 'PATCH',
			headers: headers as unknown as HeadersInit,
			body,
		});
		const json = (await res.json()) as MessageRaw;
		return await loadMessage(this.client, json);
	}
	async deleteMessage(channelId: string, messageId: string) {
		const res = await fetch(`${API}/channels/${channelId}/messages/${messageId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bot ${this.client.token}` },
		});
		return res.ok;
	}
	async fetchMessagesRaw(channelId: string, limit = 50): Promise<MessageRaw[]> {
		const res = await fetch(`${API}/channels/${channelId}/messages?limit=${limit}`, {
			headers: { Authorization: `Bot ${this.client.token}` },
		});
		return await res.json()
	}
	async fetchMessages(channelId: string, limit = 50) {
		const json = await this.fetchMessagesRaw(channelId, limit);
		return await Promise.all(json.map(message => loadMessage(this.client, message)));
	}
	async bulkDeleteMessages(channelId: string, messages: string[]) {
		const res = await fetch(`${API}/channels/${channelId}/messages/bulk-delete`, {
			method: 'POST',
			headers: { Authorization: `Bot ${this.client.token}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages }),
		});
		if(res.ok)return messages.length;
		else return 0;
	}
}

export default class Rest {
	message: RestMessage;
	constructor(private client: Client) {
		this.message = new RestMessage(this.client);
	}
	async fetchUser(id: string): Promise<UserRaw> {
		return await fetch(`${API}/users/${id}`, {
			headers: { Authorization: `Bot ${this.client.token}` },
		}).then(res => res.json());
	}
	async fetchMember(guildId: string, userId: string): Promise<MemberRaw> {
		const member = (await fetch(`${API}/guilds/${guildId}/members/${userId}`, {
			headers: { Authorization: `Bot ${this.client.token}` },
		}).then(res => res.json())) as MemberRaw;
		if (!member.user) member.user = await this.fetchUser(userId);
		return member;
	}
	async fetchGuild(id: string): Promise<GuildRaw> {
		return await fetch(`${API}/guilds/${id}`, {
			headers: { Authorization: `Bot ${this.client.token}` },
		}).then(res => res.json());
	}
	async fetchGuildChannels(id: string): Promise<ChannelRaw[]> {
		return await fetch(`${API}/guilds/${id}/channels`, {
			headers: { Authorization: `Bot ${this.client.token}` },
		}).then(res => res.json());
	}
	async fetchChannel(id: string): Promise<ChannelRaw> {
		return await fetch(`${API}/channels/${id}`, {
			headers: { Authorization: `Bot ${this.client.token}` },
		}).then(res => res.json());
	}
	async fetchRole(id: string) {
		return await fetch(`${API}/roles/${id}`, {
			headers: { Authorization: `Bot ${this.client.token}` },
		}).then(res => res.json());
	}
}
