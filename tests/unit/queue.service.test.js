import { QueueService } from '../../src/services/queue.service.js';
import { RedisQueueStorage } from '../../src/db/redis.queue.storage.js';
import redis from '../../src/db/clients/redis.client.js';

const storage = new RedisQueueStorage(redis);
const queueService = new QueueService(storage);

describe(`queueService:`, () => {
  test('peek(); should return undefined while if the queue is empty', async () => {
    expect.assertions(1);

    const one = await queueService.peek();

    expect(one).toEqual(undefined);
  });

  test(`enqueue(id); should send data and 1 error while enqueuing values 5, 3, 27, 5`, async () => {
    expect.assertions(4);

    const data = [5, 3, 27, 5];

    const one = await queueService.enqueue(data[0]);
    const two = await queueService.enqueue(data[1]);
    const three = await queueService.enqueue(data[2]);

    try {
      await queueService.enqueue(data[3]);
    } catch (error) {
      expect(error.name).toEqual('Error');
    }

    expect(one).toEqual({ patientId: 5 });
    expect(two).toEqual({ patientId: 3 });
    expect(three).toEqual({ patientId: 27 });
  });

  test('peek(); should send the same data while peeking the queue 2 times', async () => {
    expect.assertions(2);

    const one = await queueService.peek();
    const two = await queueService.peek();

    expect(one).toEqual({ patientId: 5 });
    expect(two).toEqual({ patientId: 5 });
  });

  test('dequeue(); should send corresponding data while dequeuing two times', async () => {
    expect.assertions(2);

    const one = await queueService.dequeue();
    const two = await queueService.dequeue();

    expect(one).toEqual({ patientId: 5 });
    expect(two).toEqual({ patientId: 3 });
  });

  test('peek(); should send corresponding data while peeking', async () => {
    expect.assertions(1);

    const one = await queueService.peek();

    expect(one).toEqual({ patientId: 27 });
  });
});
