export const Config = () => ({
  nodeConfiguration: {
    environment: process.env.NODE_ENV || 'development',
    port: Number(process.env.NODE_PORT) || 3000,
  },
  cronConfig: {},
});

export { Config as default };
