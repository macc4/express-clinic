import { ClinicFactory } from '../../../services/factory.js';

const databaseTypes = ['in-memory', 'redis'];

databaseTypes.forEach((type) => {
  const clinicFactory = new ClinicFactory(type);
  const patientService = clinicFactory.getPatientService;

  describe(`------ patient service  ------\n----- testing the ${type} database -----`, () => {
    test('- get non-existent patients by id (getPatient)', async () => {
      expect.assertions(2);

      const one = await patientService.getPatient(0);
      const two = await patientService.getPatient(5);

      expect(one).toEqual(undefined);
      expect(two).toEqual(undefined);
    });
    test('- create test patients (createPatient)', async () => {
      expect.assertions(5);

      const data = [
        { name: 'Bella Swan' },
        { name: 'Jacob Black' },
        { name: 'edward CULLEN' },
        { name: 'carlisle cullen' },
        { name: 'edward cullen' },
      ];

      const one = await patientService.createPatient(data[0]);
      expect(one).toEqual({ id: 1, name: 'Bella Swan' });
      const two = await patientService.createPatient(data[1]);
      expect(two).toEqual({ id: 2, name: 'Jacob Black' });
      const three = await patientService.createPatient(data[2]);
      expect(three).toEqual({ id: 3, name: 'Edward Cullen' });
      const four = await patientService.createPatient(data[3]);
      expect(four).toEqual({ id: 4, name: 'Carlisle Cullen' });

      try {
        await patientService.createPatient(data[4]);
      } catch (error) {
        expect(error.name).toEqual('ConflictError');
      }
    });
    test('- get all patients without query (getAllPatients)', async () => {
      expect.assertions(1);
      const query = {};

      const response = await patientService.getAllPatients(query);

      expect(response).toEqual([
        { id: 1, name: 'Bella Swan' },
        { id: 2, name: 'Jacob Black' },
        { id: 3, name: 'Edward Cullen' },
        { id: 4, name: 'Carlisle Cullen' },
      ]);
    });
    test('- get all patients with a query.name (getAllPatients)', async () => {
      expect.assertions(1);

      const query = { name: 'cullen' };

      const response = await patientService.getAllPatients(query);

      expect(response).toEqual([
        { id: 3, name: 'Edward Cullen' },
        { id: 4, name: 'Carlisle Cullen' },
      ]);
    });
    test('- get patients by id (getPatient)', async () => {
      expect.assertions(2);

      const one = await patientService.getPatient(1);
      const two = await patientService.getPatient(4);

      expect(one).toEqual({ id: 1, name: 'Bella Swan' });
      expect(two).toEqual({ id: 4, name: 'Carlisle Cullen' });
    });
    test('- delete patients by id (deletePatient)', async () => {
      expect.assertions(2);

      const one = await patientService.deletePatient(1);
      const two = await patientService.deletePatient(4);

      expect(one).toEqual({ id: 1, name: 'Bella Swan' });
      expect(two).toEqual({ id: 4, name: 'Carlisle Cullen' });
    });
    test('- get the remaing patients (getAllPatients)', async () => {
      expect.assertions(1);
      const query = {};

      const response = await patientService.getAllPatients(query);

      expect(response).toEqual([
        { id: 2, name: 'Jacob Black' },
        { id: 3, name: 'Edward Cullen' },
      ]);
    });
  });
});
