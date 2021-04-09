import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';

export function applyMiddlewares(app: INestApplication) {
  app.use(
    session({
      secret: 'illchangeitlayerinconfigurationfile',
      resave: false,
      saveUninitialized: false,
    }),
  );
}
