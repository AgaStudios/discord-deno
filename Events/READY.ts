import Client from '@cl/Client.ts';
import User, { type UserRaw } from '@s/User.ts';

interface ReadyRaw {
	v: number;
	user: UserRaw;
	guilds: {
		id: string;
		unavailable: true;
	}[];
	session_id: string;
	resume_gateway_url: string;
	shard?: [number, number];
	application?: ApplicationRaw; // TODO: Implement partial application object
}

interface ApplicationRaw {
	id: string;
	name: string;
	icon: string | null;
	description: string;
	rpc_origins?: string[];
	bot_public: boolean
	bot_require_code_grant: boolean;
	bot?: UserRaw;
	terms_of_service_url?: string;
	privacy_policy_url?: string;
	owner?: UserRaw;
	verify_key: string;
	team?: any;
	guild_id?: string;
	guild?: any;
	primary_sku_id?: string;
	slug?: string;
	cover_image?: string;
	flags?: number;
	approximate_guild_count?: number;
	approximate_user_install_count?: number;
	redirect_uris?: string[];
	interactions_endpoint_url?: string;
	role_connections_verification_url?: string;
	event_webhooks_url?: string;
	event_webhooks_status: number;
	event_webhooks_types?: string[];
	tags?: string[];
	install_params?: any;
	integration_types_config?: Record<string, any>;
	custom_install_url?: string;
}

export default async function READY(client: Client, data: ReadyRaw) {
	console.log(data);
	client.user = new User(data.user);
	for (const guild of data.guilds) 
		await client.guilds.getID(guild.id);
	client.emit('ready', client);
}

export type READY = {
	name: 'ready';
	callback(client: Client): void;
};
