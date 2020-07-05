import * as AWS from 'aws-sdk';

import { SQS_CLIENT, SQS_MODULE_OPTIONS } from './sqs.constants';

import { Provider } from '@nestjs/common';
import { SQSModuleOptions } from './sqs.interface';
import { v4 } from 'uuid';

export interface SqsClient {
  defaultKey: string;
  clients: Map<string, AWS.SQS>;
  size: number;
}

export class SqsClientError extends Error {}
export const createClient = (): Provider => ({
  provide: SQS_CLIENT,
  useFactory: async (
    options: SQSModuleOptions | SQSModuleOptions[],
  ): Promise<SqsClient> => {
    const clients = new Map<string, AWS.SQS>();
    let defaultKey = v4();

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async o => {
          const key = o.name || defaultKey;
          if (clients.has(key)) {
            throw new SqsClientError(`${o.name || 'default'} client is exists`);
          }
          clients.set(key, await getClient(o));
        }),
      );
    } else {
      if (options.name && options.name.length !== 0) {
        defaultKey = options.name;
      }
      clients.set(defaultKey, await getClient(options));
    }

    return {
      defaultKey,
      clients,
      size: clients.size,
    };
  },
  inject: [SQS_MODULE_OPTIONS],
});

async function getClient(options: SQSModuleOptions): Promise<AWS.SQS> {
  const config: AWS.SQS.ClientConfiguration = {
    endpoint: options.endPoint,
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
    region: options.region,
  };

  return new AWS.SQS(config);
}
