import { Gateway } from '../constants/Constants.ts';
import { Heartbeat, Identify } from '../constants/Payload.ts';
import * as Events from '../Events/index.ts';
import type Client from "./Client.ts";

export default class WebSocketManager {
  ws!: WebSocket;
  interval!: number;
  constructor(public client: Client, private readonly intents = 1) {}
  connect(token: string) {
    this.ws = new WebSocket(Gateway);
    this.ws.addEventListener('message', data => {
      const obj = JSON.parse(data.data.toString());
      const event = obj.t as keyof typeof Events;
      const _s = obj.s;
      const op = obj.op;
      const d = obj.d;

      if (op === 10) {
        this.interval = this.heartbeat(d.heartbeat_interval);
        this.identify(token);
      } else if (op === 11) return;
      console.log(event)
      if (event) Events[event] && Events[event](this.client, obj.d);
    });
    this.ws.addEventListener('close', (e) => console.log(e,clearInterval(this.interval)));
  }
  identify(token: string) {
    if (!token) throw new Error('No token provided');
    if (typeof token !== 'string') throw new Error('Token must be a string');
    Identify.d.token = token;
    Identify.d.intents = this.intents;
    this.send(Identify);
  }
  heartbeat(ms: number): number {
    return setInterval(() => this.send(Heartbeat), ms);
  }
  send(data: {op:number,d:unknown}) {
    this.ws.send(JSON.stringify(data));
  }
}
