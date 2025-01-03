import { GuildRaw } from 'discord/structures/Guild.ts';
import { TeamRaw } from 'discord/structures/Team.ts';
import { UserRaw } from 'discord/structures/User.ts';

export const enum ApplicationFlags {
	APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE = 1 << 6,
	GATEWAY_PRESENCE = 1 << 12,
	GATEWAY_PRESENCE_LIMITED = 1 << 13,
	GATEWAY_GUILD_MEMBERS = 1 << 14,
	GATEWAY_GUILD_MEMBERS_LIMITED = 1 << 15,
	VERIFICATION_PENDING_GUILD_LIMIT = 1 << 16,
	EMBEDDED = 1 << 17,
	GATEWAY_MESSAGE_CONTENT = 1 << 18,
	GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19,
	APPLICATION_COMMAND_BADGE = 1 << 23,
}
export interface InstallParamsRaw {
	prompt?: string;
	scopes?: string[];
}
export interface ApplicationRaw {
	id: string;
	name: string;
	icon: string | null;
	description: string;
	rpc_origins?: string[];
	bot_public: boolean;
	bot_require_code_grant: boolean;
	bot?: UserRaw;
	terms_of_service_url?: string | null;
	privacy_policy_url?: string | null;
	owner?: UserRaw;
	summary: string | null;
	verify_key: string;
	team?: TeamRaw;
	guild_id?: string;
	guild?: GuildRaw;
	primary_sku_id?: string;
	slug?: string;
	cover_image?: string | null;
	flags?: number;
	approximate_guild_count?: number;
	redirect_uris?: string[];
	interactions_endpoint_url?: string;
	role_connections_verification_url?: string;
	tags?: string[];
	install_params?: InstallParamsRaw;
	custom_install_url?: string;
}
