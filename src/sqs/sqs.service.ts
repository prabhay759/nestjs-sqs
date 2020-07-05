import { Inject, Injectable } from '@nestjs/common';

import * as AWS from 'aws-sdk';
import { SQS_CLIENT } from './sqs.constants';
import { SqsClient, SqsClientError } from './sqs.client';

@Injectable()
export class SqsService {
  constructor(@Inject(SQS_CLIENT) private readonly sqsClient: SqsClient) {}

  getClient(name?: string): AWS.SQS {
    if (!name) {
      name = this.sqsClient.defaultKey;
    }
    if (!this.sqsClient.clients.has(name)) {
      throw new SqsClientError(`client ${name} does not exist`);
    }
    return this.sqsClient.clients.get(name);
  }

  getClients(): Map<string, AWS.SQS> {
    return this.sqsClient.clients;
  }
}
