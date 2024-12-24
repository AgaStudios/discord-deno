import Client from '@cl/Client.ts';
import Guild, { GuildRaw, loadGuildFromRaw } from '@s/Guild.ts';

export default async function GUILD_CREATE(client: Client, data: GuildRaw) {
  const guild = await loadGuildFromRaw(client, data);
  client.guilds.add(guild);
  client.emit('guildCreate', guild);
}
export type GUILD_CREATE = {
	name: 'guildCreate';
	callback(guild: Guild): void;
};