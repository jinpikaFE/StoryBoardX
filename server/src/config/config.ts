export default () => {
  const appEnv = (
    process.env.APP_ENV ||
    (process.env.NODE_ENV === 'production' ? 'prod' : process.env.NODE_ENV === 'test' ? 'test' : 'dev')
  ).toLowerCase();
  const isProd = appEnv === 'prod';

  const port = (() => {
    const raw = process.env.PORT ?? process.env.SERVER_PORT;
    if (!raw) return isProd ? 5000 : 8000;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : isProd ? 5000 : 8000;
  })();

  const databasePort = (() => {
    const raw = process.env.DATABASE_PORT;
    if (!raw) return 5432;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : 5432;
  })();

  return {
    appEnv,
    port,
    database: {
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      url: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true',
    },
  };
};
