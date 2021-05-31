import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

import { AllExceptionsFilter } from './app.http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
//
// ─── DB ─────────────────────────────────────────────────────────────────────────
//
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { SalesModule } from './sales/sales.module';
import { FeedbackModule } from './feedback/feedback.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationGateway } from './notification.gateway';
import { ProductModule } from './product/product.module';
import { PurchasementModule } from './purchasement/purchasement.module';
import { QualityControlModule } from './quality-control/quality-control.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
// ────────────────────────────────────────────────────────────────────────────────
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthenticationModule,
    UserModule,
    SalesModule,
    FeedbackModule,
    NotificationModule,
    ProductModule,
    PurchasementModule,
    QualityControlModule,
    MaintenanceModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    NotificationGateway,
  ],
})
export class AppModule {}
