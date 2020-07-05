import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { PollerService } from './poller/poller.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Started polling SQS Queue
  const pollerService = app.get<PollerService>(PollerService);
  pollerService.poll();

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
