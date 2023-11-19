import { UserRaw } from "./User.ts";

export const enum MemberFlags {
  DID_REJOIN = 1 << 0,
  COMPLETED_ONBOARDING = 1 << 1,
  BYPASSES_VERIFICATION = 1 << 2,
  STARTED_ONBOARDING = 1 << 3,
}

export interface MemberRaw {
  user?: UserRaw,
  nick?: string | null,
  avatar?: string | null,
  roles: string[],
  joined_at: string,
  premium_since?: string | null,
  deaf: boolean,
  mute: boolean,
  flags?: number,
  pending?: boolean,
  permissions?: string,
  communication_disabled_until?: string | null,
}