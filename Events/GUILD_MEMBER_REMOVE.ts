import Client from 'discord/client/Client.ts';
import { loadGuildFromId } from 'discord/structures/Guild.ts';
import Member, { type MemberRaw } from "discord/structures/Member.ts";

export default async function GUILD_MEMBER_REMOVE(client: Client, data: MemberRaw) {
	const guild = await loadGuildFromId(client, data.guild_id);
	const member = guild.members.remove(data.user!.id);
	if(member)client.emit('guildMemberRemove', member);
}
export type GUILD_MEMBER_REMOVE = {
	guildMemberRemove(removedMember: Member): void;
};
