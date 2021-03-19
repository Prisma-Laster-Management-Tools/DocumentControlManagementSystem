import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import ConfigManagement from 'src/utilities/conf_management';

const dbConfig = ConfigManagement.extractConfigVariables('db');
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/model/*.entity.{js,ts}'],
  synchronize: true,
};
