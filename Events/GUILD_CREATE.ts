import Client from 'discord/client/Client.ts';
import Guild, { GuildRaw, loadGuildFromRaw } from 'discord/structures/Guild.ts';

export default async function GUILD_CREATE(client: Client, data: GuildRaw) {
	const guild = await loadGuildFromRaw(client, data);
	client.guilds.add(guild);
	client.emit('guildCreate', guild);
}
export type GUILD_CREATE = {
	guildCreate(guild: Guild): void;
};
