import { Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PollerModule } from './poller/poller.module';

@Module({
  imports: [ConfigModule.forRoot(), PollerModule],
})
export class AppModule implements NestModule {
  configure(): void {}
}
