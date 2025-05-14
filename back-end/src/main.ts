import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONT_END_URL,
  });

  const port = process.env.PORT;

  await app.listen(Number(port));
  console.log(`Application is running on port ${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
});
