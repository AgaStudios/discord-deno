import Client from './client/Client.ts';
import * as Intents from './constants/Intents.ts';
import secret from './secret.json' assert { type: 'json' };
import Embed from "./structures/Embed.ts";
import { MessageCreate } from "./structures/Message.ts";

const client = new Client(Object.values(Intents).reduce((a, b) => a + b, 0));

client.on('ready', async () => {
  console.log('Ready!', client);
}).on('messageCreate', async (message) => {
  if(message.author.bot) return;
  const embed = new Embed({image: {url: `attachment://${message.attachments[0].filename}`}})
  message.reply({attachments:[message.attachments[0]], content: message.content, embeds: [embed]})
  //console.log(message, MessageCreate.fromMessage(message))
})

client.login(secret.TOKEN);