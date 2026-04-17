import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import configFactory from './config/config';

const rootPath = process.cwd();
const baseEnvPath = path.resolve(rootPath, '.env');
if (fs.existsSync(baseEnvPath)) {
  dotenv.config({ path: baseEnvPath });
}

const appEnv =
  process.env.APP_ENV ||
  (process.env.NODE_ENV === 'production' ? 'prod' : process.env.NODE_ENV === 'test' ? 'test' : 'dev');
const appEnvPath = path.resolve(rootPath, `.env.${appEnv}`);
if (fs.existsSync(appEnvPath)) {
  dotenv.config({ path: appEnvPath, override: true });
}

const config = configFactory();

export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  entities: [path.join(__dirname, '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
});
