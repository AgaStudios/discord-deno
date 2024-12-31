import Client from 'discord/client/Client.ts';
import { loadGuildFromId } from 'discord/structures/Guild.ts';
import Member, { loadMemberFromRaw, type MemberRaw } from "discord/structures/Member.ts";

export default async function GUILD_MEMBER_ADD(client: Client, data: MemberRaw) {
	const guild = await loadGuildFromId(client, data.guild_id);
	const member = await guild.members.tryGetIDOrAdd(data.user!.id, ()=>loadMemberFromRaw(client, guild, data))
	client.emit('guildMemberAdd', member);
}
export type GUILD_MEMBER_ADD = {
	guildMemberAdd(newMember: Member): void;
};
