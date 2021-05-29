import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as morgan from 'morgan';

export function applyMiddlewares(app: INestApplication) {
  app.use(
    session({
      secret: 'illchangeitlayerinconfigurationfile',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(morgan('dev'));
  app.enableCors();
}
