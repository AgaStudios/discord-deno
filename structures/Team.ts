import { UserRaw } from '@s/User.ts';

export const enum TeamMembershipState {
	INVITED = 1,
	ACCEPTED = 2,
}
export interface TeamMemberRaw {
	membership_state: TeamMembershipState;
	permissions: string[];
	team_id: string;
	user: UserRaw;
}

export interface TeamRaw {
	icon: string | null;
	id: string;
	members: TeamMemberRaw[];
	name: string;
	owner_user_id: string;
}
