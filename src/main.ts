import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import ConfigManagement from './utilities/conf_management';
import { ValidationPipeWithCustomException } from './validation';
import { applyMiddlewares } from './app.middleware';

async function bootstrap() {
  const serverConfig = ConfigManagement.extractConfigVariables('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  applyMiddlewares(app);

  app.useGlobalPipes(ValidationPipeWithCustomException);
  app.setGlobalPrefix('api'); // prefix the route with /api/

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port, () =>
    logger.log(`Application listening on port ${port}`),
  );
}
bootstrap();
