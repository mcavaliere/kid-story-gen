// Base settings we want to apply to client, server and edge environments. Override as needed.
export const sentryBaseConfig = {
  dsn: 'https://8b1132ef0a0db4189adb8a5b6faf1efe@o181405.ingest.sentry.io/4506757889916928',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // &&
  // (process.env.DEBUG === 'true' || process.env.NEXT_PUBLIC_DEBUG === 'true'),
};
