import { Injectable } from '@nestjs/common';
import { SqsService } from '../sqs/sqs.service';
import { config } from '../sqs/config';

@Injectable()
export class PollerService {
  private readonly pollAfter = 5 * 1000;

  constructor(private readonly sqsService: SqsService) {}
  public async poll(): Promise<void> {
    const sqsClient = await this.sqsService.getClient();

    const receiveMessageParam: AWS.SQS.ReceiveMessageRequest = {
      QueueUrl: `${config.endPoint}/queue/default`,
      MaxNumberOfMessages: 5,
      VisibilityTimeout: 10, // Message will reappear in Queue after 10 seconds.
    };

    const messages = await sqsClient
      .receiveMessage(receiveMessageParam)
      .promise();

    if (messages && messages.Messages && messages.Messages.length) {
      for (let index = 0; index < messages.Messages.length; index++) {
        const message = JSON.parse(messages.Messages[index].Body);
        const email = message.email;
        const requestId = message.requestId;

        console.log('Reading message from the SQS', message);

        // Confirms the message.
        await sqsClient
          .deleteMessage({
            QueueUrl: `${config.endPoint}/queue/default`,
            ReceiptHandle: messages.Messages[index].ReceiptHandle,
          })
          .promise();
      }
    }

    // Poll every 5 seconds
    setTimeout(
      async () =>
        await this.poll().catch(async err => {
          console.error(
            `Error occured in processing the message: ${err.message}`,
            err.stack,
          );
        }),
      this.pollAfter,
    );
  }
}
