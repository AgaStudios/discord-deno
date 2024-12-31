import mime from 'https://raw.githubusercontent.com/micnic/mime.json/master/index.json' with {type:'json'};
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
  id = 0;
  constructor(public filename: string, public data: Uint8Array, public description?: string){}
  toBlob(){
    const type = (this.filename.split('.').pop()||'') as keyof typeof mime
    return new Blob([this.data], { type: mime[type] || 'application/octet-stream' });
  }
  toJSON(){
    return {
      id: this.id,
      filename: this.filename,
      description: this.description,
    }
  }
}