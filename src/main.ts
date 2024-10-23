import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));
  
  app.enableCors(); // add
  await app.listen(3000);
}
bootstrap();
