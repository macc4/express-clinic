import { PatientService } from '../../src/services/patient.service.js';
import { SequelizePatientStorage } from '../../src/db/sequelize.patient.storage.js';
import sequelize from '../../src/db/clients/sequelize.client.js';

const storage = new SequelizePatientStorage(sequelize);
const patientService = new PatientService(storage);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('patientService:', () => {
  describe('create(body);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.createOne = jest.fn().mockResolvedValue({
        id: 1,
        name: 'Edward',
        gender: 'male',
        birthday: '01-01-1995',
        userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
        createdAt: '2021-09-09T06:09:51.000Z',
        updatedAt: '2021-09-09T06:09:51.000Z',
      });

      const result = await patientService.create({
        name: 'Edward',
        gender: 'male',
        birthday: '01-01-1995',
        userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
      });

      expect(storage.createOne).toBeCalled();
      expect(result.id).toEqual(1);
    });

    test('should throw an error if duplicate or non-existent userId', async () => {
      expect.assertions(2);

      storage.createOne = jest.fn().mockImplementation(() => {
        throw new Error('Error Message');
      });

      try {
        await patientService.create({
          name: 'Edward',
          gender: 'male',
          birthday: '01-01-1995',
          userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
        });
      } catch (error) {
        expect(storage.createOne).toBeCalled();
        expect(error.message).toEqual('Error Message');
      }
    });
  });

  describe('getAll(query);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getAll = jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Edward',
          gender: 'male',
          birthday: '01-01-1995',
          userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
          createdAt: '2021-09-09T06:09:51.000Z',
          updatedAt: '2021-09-09T06:09:51.000Z',
        },
      ]);

      const query = {};

      const result = await patientService.getAll(query);

      expect(storage.getAll).toBeCalled();
      expect(result[0].id).toEqual(1);
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(2);

      storage.getAll = jest.fn().mockResolvedValue([]);

      const query = {};

      const result = await patientService.getAll(query);

      expect(storage.getAll).toBeCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getByID(id);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getByID = jest.fn().mockResolvedValue({
        id: 1,
        name: 'Edward',
        gender: 'male',
        birthday: '01-01-1995',
        userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
        createdAt: '2021-09-09T06:09:51.000Z',
        updatedAt: '2021-09-09T06:09:51.000Z',
      });

      const result = await patientService.getByID(1);

      expect(storage.getByID).toBeCalled();
      expect(result.id).toEqual(1);
    });

    test('should return undefined if no data found', async () => {
      expect.assertions(2);

      storage.getByID = jest.fn().mockResolvedValue(undefined);

      const result = await patientService.getByID(5);

      expect(storage.getByID).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('deleteByID(id);', () => {
    test('should return 1 if successful (sequelize-specific test)', async () => {
      expect.assertions(2);

      storage.deleteByID = jest.fn().mockResolvedValue(1);

      const result = await patientService.deleteByID(1);

      expect(storage.deleteByID).toBeCalled();
      expect(result).toEqual(1);
    });

    test('should return 0 if failed (sequelize-specific test)', async () => {
      expect.assertions(2);

      storage.deleteByID = jest.fn().mockResolvedValue(0);

      const result = await patientService.deleteByID(1);

      expect(storage.deleteByID).toBeCalled();
      expect(result).toEqual(0);
    });
  });

  describe('getByUserID(userId);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getByUserID = jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Edward',
          gender: 'male',
          birthday: '01-01-1995',
          userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
          createdAt: '2021-09-09T06:09:51.000Z',
          updatedAt: '2021-09-09T06:09:51.000Z',
        },
      ]);

      const result = await patientService.getByUserID(
        'a00bf660-10e0-11ec-8c60-d78305534610',
      );

      expect(storage.getByUserID).toBeCalled();
      expect(result[0].id).toEqual(1);
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(2);

      storage.getByUserID = jest.fn().mockResolvedValue([]);

      const result = await patientService.getByUserID(
        'a00bf660-10e0-11ec-8c60-d78305534610',
      );

      expect(storage.getByUserID).toBeCalled();
      expect(result).toEqual([]);
    });
  });
});
