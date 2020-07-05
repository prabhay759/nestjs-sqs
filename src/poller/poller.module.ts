import { Module } from '@nestjs/common';
import { PollerService } from './poller.service';
import { SqsModule } from '../sqs/sqs.module';

@Module({
  imports: [SqsModule],
  providers: [PollerService],
  exports: [PollerService],
})
export class PollerModule {}
