export {default as READY} from './READY.ts';
export {default as GUILD_CREATE} from './GUILD_CREATE.ts';
export {default as MESSAGE_CREATE} from './MESSAGE_CREATE.ts';

import type {MESSAGE_CREATE} from './MESSAGE_CREATE.ts'
import type {READY} from "./READY.ts";

export type Events = {
  'messageCreate': MESSAGE_CREATE['callback'];
  'ready': READY['callback'];
}