import { Sequelize } from 'sequelize-typescript';
import { env } from './env.js';
import { User } from '../models/User.js';
import { UserSession } from '../models/UserSession.js';
import { LoginAttempt } from '../models/LoginAttempt.js';
import { AuthLog } from '../models/AuthLog.js';

export const sequelize = new Sequelize(
  env.database.name,
  env.database.user,
  env.database.password,
  {
    host: env.database.host,
    port: env.database.port,
    dialect: 'mysql',
    models: [User, UserSession, LoginAttempt, AuthLog]
  },
);

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  console.log('Connexion à MySQL réussie.');
}