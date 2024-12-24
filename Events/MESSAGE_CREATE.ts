import Client from "../client/Client.ts";
import Message, { MessageRaw, loadMessage } from "../structures/Message.ts";

export default async function MESSAGE_CREATE(client: Client, data: MessageRaw) {
  const message = await loadMessage(client, data);
  client.emit('messageCreate', message);
}

export type MESSAGE_CREATE = {
  name: 'messageCreate';
  callback(message: Message):void;
};