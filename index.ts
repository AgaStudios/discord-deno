import Client from './client/Client.ts';
import * as Intents from './constants/Intents.ts';
import secret from './secret.json' assert { type: 'json' };
import { TextChannel } from "./structures/Channel.ts";

const client = new Client(Object.values(Intents).reduce((a, b) => a + b, 0));
client.login(secret.TOKEN);

client.on('ready', async () => {
  console.log('Ready!');
  const channel = (await client.channels.getID('915708885313151038')) as TextChannel;
  if(!channel) return;
  channel.send('test')
});
