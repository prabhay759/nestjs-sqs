import { DynamicModule, Module } from '@nestjs/common';

import { SQSModuleOptions } from './sqs.interface';
import { SqsCoreModule } from './sqs-core.module';

@Module({})
export class SqsModule {
  static register(
    options: SQSModuleOptions | SQSModuleOptions[],
  ): DynamicModule {
    return {
      module: SqsModule,
      imports: [SqsCoreModule.register(options)],
    };
  }
}
