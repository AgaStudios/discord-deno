export { default as READY } from '@e/READY.ts';
export { default as GUILD_CREATE } from '@e/GUILD_CREATE.ts';
export { default as MESSAGE_CREATE } from '@e/MESSAGE_CREATE.ts';

import type { MESSAGE_CREATE } from '@e/MESSAGE_CREATE.ts';
import type { READY } from '@e/READY.ts';
import type { GUILD_CREATE } from '@e/GUILD_CREATE.ts';


type Value = { name: string, callback(...args: unknown[]): void}

type Mapping<T extends Value> = {
	[k in T['name']]: T['callback'];
}

export type Events = Mapping<MESSAGE_CREATE> & Mapping<READY> & Mapping<GUILD_CREATE>;
