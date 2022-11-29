import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // test
  // disabled because it injected directly in app module
  // app.use(
  //   cookieSession({
  //     keys: ['cookies-secret-key'],
  //   }),
  // );

  // disabled because it injected directly in app module
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // ignore unrecognized request body properties
  //   }),
  // );

  await app.listen(3000);
}
bootstrap();
