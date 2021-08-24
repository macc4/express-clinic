import { ClinicFactory } from '../../../services/factory.js';

const databaseTypes = ['in-memory', 'redis'];

databaseTypes.forEach((type) => {
  const clinicFactory = new ClinicFactory(type, type);
  const patientService = clinicFactory.getPatientService;
  const resolutionService = clinicFactory.getResolutionService;

  describe(`------ resolution service  ------\n------ testing the ${type} database -----`, () => {
    test('- try getting resolutions for a non-existent patient or a patient without any resolutions', async () => {
      expect.assertions(1);

      const response = await resolutionService.getAllResolutionsForThePatient(5);

      expect(response).toEqual([]);
    });
    test('- try getting a non-existent resolution by id', async () => {
      expect.assertions(1);

      const response = await resolutionService.getResolutionById(55);

      expect(response).toEqual(undefined);
    });
    test('- create a new patient and resolutions for him', async () => {
      expect.assertions(7);

      await patientService.createPatient({ name: 'Edward Cullen' });
      const bodyOne = { resolution: 'He is a vampire!' };
      const bodyTwo = { resolution: 'He still is.' };
      const bodyThree = { resolution: 'He is dead.' };
      const params = { patientId: 1 };

      const responseOne = await resolutionService.createResolution(bodyOne, params);
      const responseTwo = await resolutionService.createResolution(bodyTwo, params);
      const responseThree = await resolutionService.createResolution(bodyThree, params);

      expect(responseOne.resolution).toEqual('He is a vampire!');
      expect(responseOne.patientId).toEqual(1);
      expect(responseOne.id).toEqual(1);
      expect(responseTwo.resolution).toEqual('He still is.');
      expect(responseThree.id).toEqual(3);
      expect(responseThree.patientId).toEqual(1);
      expect(responseThree.resolution).toEqual('He is dead.');
    });
    test('- try creating a resolution for a non-existent patient', async () => {
      expect.assertions(1);

      const body = { resolution: 'He is a vampire!' };
      const params = { id: 555 };

      try {
        await resolutionService.createResolution(body, params);
      } catch (error) {
        expect(error.statusCode).toEqual(404);
      }
    });
    test('- get one resolution for the patient', async () => {
      expect.assertions(2);

      const response = await resolutionService.getResolutionById(1);

      expect(response.patientId).toEqual(1);
      expect(response.resolution).toEqual('He is a vampire!');
    });
    test('- get all resolutions for the patient', async () => {
      expect.assertions(6);

      const response = await resolutionService.getAllResolutionsForThePatient(1);

      expect(response[0].patientId).toEqual(1);
      expect(response[1].patientId).toEqual(1);
      expect(response[2].patientId).toEqual(1);
      expect(response[0].resolution).toEqual('He is a vampire!');
      expect(response[1].resolution).toEqual('He still is.');
      expect(response[2].resolution).toEqual('He is dead.');
    });
    test('- delete all resolutions for the patient', async () => {
      expect.assertions(6);

      const response = await resolutionService.deleteAllResolutionsForThePatient(1);

      expect(response[0].patientId).toEqual(1);
      expect(response[1].patientId).toEqual(1);
      expect(response[2].patientId).toEqual(1);
      expect(response[0].resolution).toEqual('He is a vampire!');
      expect(response[1].resolution).toEqual('He still is.');
      expect(response[2].resolution).toEqual('He is dead.');
    });
    test('- try finding resolutions for the deleted patient', async () => {
      expect.assertions(1);

      const response = await resolutionService.getAllResolutionsForThePatient(1);

      expect(response).toEqual([]);
    });
  });
});
