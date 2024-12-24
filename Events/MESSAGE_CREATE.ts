import Client from '@cl/Client.ts';
import Message, { MessageRaw, loadMessage } from '@s/Message.ts';

export default async function MESSAGE_CREATE(client: Client, data: MessageRaw) {
	const message = await loadMessage(client, data);
	client.emit('messageCreate', message);
}

export type MESSAGE_CREATE = {
	name: 'messageCreate';
	callback(message: Message): void;
};
