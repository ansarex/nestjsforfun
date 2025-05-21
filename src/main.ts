import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['asdfahsfhf'],

  })),

    app.useGlobalPipes(
      new ValidationPipe({
        // to secure where people cant add other data into the json
        whitelist: true,
      }),
    )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
