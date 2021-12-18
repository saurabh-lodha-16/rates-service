import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Config from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Config().nodeConfiguration.port);
}
bootstrap();
