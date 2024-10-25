import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import dbConfig from './db/db.config';
import { LoginLoggerMiddleware } from './middlewares/login-logger.middleware';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load:[dbConfig] }), 
    UsersModule, 
    DbModule, 
    ItemsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginLoggerMiddleware)
    .forRoutes({ path: '*login*', method: RequestMethod.POST})
  }
}
