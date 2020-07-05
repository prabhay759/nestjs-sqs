import { DynamicModule, Global, Inject, Module } from '@nestjs/common';

import { SQSModuleOptions } from './sqs.interface';
import { SQS_MODULE_OPTIONS } from './sqs.constants';
import { SqsService } from './sqs.service';
import { createClient } from './sqs.client';

@Global()
@Module({
  providers: [SqsService],
  exports: [SqsService],
})
export class SqsCoreModule {
  constructor(
    @Inject(SQS_MODULE_OPTIONS)
    private readonly options: SQSModuleOptions | SQSModuleOptions[],
  ) {}

  static register(
    options: SQSModuleOptions | SQSModuleOptions[],
  ): DynamicModule {
    return {
      module: SqsCoreModule,
      providers: [
        createClient(),
        { provide: SQS_MODULE_OPTIONS, useValue: options },
      ],
      exports: [SqsService],
    };
  }
}
