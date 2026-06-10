import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTest ? ':memory:' : './database.sqlite',
  logging: false,
});

export default sequelize;
