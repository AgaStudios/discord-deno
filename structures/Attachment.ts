export const enum AttachmentFlags {
  IS_REMIX = 1 << 2,
}
export interface AttachmentRaw {
  id: string;
  filename: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number;
  width?: number;
  ephemeral?: boolean;
  duration_secs?: number;
  waveform?: string;
  flags?: number;
}

export default class Attachment{
  constructor(public name: string, public data: Uint8Array){ }
}