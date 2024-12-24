import Client from "../client/Client.ts";
import User from "../structures/User.ts";

export default async function READY(client: Client, data: any) {
  client.user = new User(data.user);
  client.emit('ready', client);
}

export type READY = {
  name: 'ready';
  callback(client: Client):void;
};