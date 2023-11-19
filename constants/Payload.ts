export const Hello = {
  op: 10,
  d: null,
};
export const Heartbeat = {
  op: 1,
  d: null,
};
export const Identify = {
  op: 2,
  d: {
    token: '',
    properties: {
      os: 'linux',
      browser: 'agal-discord-lib',
      device: 'agal-discord-lib',
    },
    intents: 1,
  },
};
export const PresenceUpdate = {
  op: 3,
  d: {
    "since": Date.now(),
    activities: [
      {
        name: 'Minecraft Bedrock',
        type: 0
      },
    ],
    status: 'online',
    afk: false,
  },
};
