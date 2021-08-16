import queueModel from '../../models/queueModel.js';
import { redisClient } from '../../db/redis.js';

redisClient.flushall();

describe('1) enqueue', () => {
  it('returns the patient object with the correct data', async () => {
    expect.assertions(1);
    const bodyTimeToLive = 5;
    const currentTime = new Date();
    const timeToLive = currentTime.getTime() + bodyTimeToLive * 60 * 1000;

    const body = { name: 'Edward Cullen', timeToLive: timeToLive };
    const res = await queueModel.enqueue(body);

    expect(res.name).toEqual('Edward Cullen');
  });
  it('returns an error because we try adding the same patient to the database', async () => {
    expect.assertions(1);
    const body = { name: 'Edward Cullen', timeToLive: 5 };

    try {
      await queueModel.enqueue(body);
    } catch (e) {
      expect(e.message).toEqual('Database already contains this data.');
    }
  });
  it('returns the patient object with the correct data', async () => {
    expect.assertions(1);
    const bodyTimeToLive = 5;
    const currentTime = new Date();
    const timeToLive = currentTime.getTime() + bodyTimeToLive * 60 * 1000;

    const body = { name: 'Bella Swan', timeToLive: timeToLive };
    const res = await queueModel.enqueue(body);

    expect(res.name).toEqual('Bella Swan');
  });
});
describe('2) peek', () => {
  it('returns the correct data of the patient', async () => {
    expect.assertions(1);
    const res = await queueModel.peek();
    expect(res.name).toEqual('Edward Cullen');
  });
});
describe('3) dequeue', () => {
  it('returns the correct data of the patient deleted patient', async () => {
    expect.assertions(1);
    const res = await queueModel.dequeue();
    expect(res.name).toEqual('Edward Cullen');
  });
});
describe('4) peek', () => {
  it('returns the correct data of the person that was second in the queue before deletion', async () => {
    expect.assertions(1);
    const res = await queueModel.peek();
    expect(res.name).toEqual('Bella Swan');
  });
});
describe('5) dequeue', () => {
  it('returns the correct data of the patient deleted patient', async () => {
    expect.assertions(1);
    const res = await queueModel.dequeue();
    expect(res.name).toEqual('Bella Swan');
  });
});
describe('6) peek', () => {
  it('returns undefined due to missing data', async () => {
    expect.assertions(1);
    const res = await queueModel.peek();
    expect(res).toEqual(undefined);
  });
});
