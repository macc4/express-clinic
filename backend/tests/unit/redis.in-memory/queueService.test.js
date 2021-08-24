import { ClinicFactory } from './../../../services/factory.js';

const databaseTypes = ['in-memory', 'redis'];

databaseTypes.forEach((type) => {
  const clinicFactory = new ClinicFactory(type, type);
  const queueService = clinicFactory.getQueueService;

  describe(`------ queue service  ------\n----- testing the ${type} database -----`, () => {
    test('- peek an empty queue', async () => {
      expect.assertions(1);

      const one = await queueService.peek();

      expect(one).toEqual(undefined);
    });
    test(`- enqueue patientId's with 1 duplicate`, async () => {
      expect.assertions(4);

      const data = [
        { patientId: 5 },
        { patientId: 3 },
        { patientId: 27 },
        { patientId: 5 },
      ];

      const one = await queueService.enqueue(data[0]);
      const two = await queueService.enqueue(data[1]);
      const three = await queueService.enqueue(data[2]);

      try {
        await queueService.enqueue(data[3]);
      } catch (error) {
        expect(error.name).toEqual('ConflictError');
      }

      expect(one).toEqual({ patientId: 5 });
      expect(two).toEqual({ patientId: 3 });
      expect(three).toEqual({ patientId: 27 });
    });
    test('- peek the queue 2 times and receive the same response', async () => {
      expect.assertions(2);

      const one = await queueService.peek();
      const two = await queueService.peek();

      expect(one).toEqual({ patientId: 5 });
      expect(two).toEqual({ patientId: 5 });
    });
    test('- dequeue the queue 2 times', async () => {
      expect.assertions(2);

      const one = await queueService.dequeue();
      const two = await queueService.dequeue();

      expect(one).toEqual({ patientId: 5 });
      expect(two).toEqual({ patientId: 3 });
    });
    test('- peek the queue and receive the correct patient', async () => {
      expect.assertions(1);

      const one = await queueService.peek();

      expect(one).toEqual({ patientId: 27 });
    });
  });
});
