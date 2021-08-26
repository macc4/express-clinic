import { QueueFactory } from '../../models/queueFactory.js';

const queueFactory = new QueueFactory('in-memory');
const queueModel = queueFactory.create();

const requests = [
  {
    name: 'EDWARD cullen',
  },
  {
    name: 'bella Swan',
  },
];

describe('queue model (in-memory) --->', () => {
  describe('1) enqueue', () => {
    it('returns the patient name back, capitalized', async () => {
      expect.assertions(1);
      const res = await queueModel.enqueue(requests[0]);

      expect(res.name).toEqual('Edward Cullen');
    });

    it('returns an error because we try adding the same patient to the database', async () => {
      try {
        await queueModel.enqueue(requests[0]);
      } catch (e) {
        expect(e.message).toEqual('Database already contains this data.');
      }
    });

    it('returns the patient object with the correct data', async () => {
      expect.assertions(1);

      const res = await queueModel.enqueue(requests[1]);

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
});
