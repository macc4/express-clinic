import { DoctorService } from './doctor.service.js';
import { SequelizeDoctorStorage } from '../db/sequelize.doctor.storage.js';
import sequelize from '../db/clients/sequelize.client.js';

const storage = new SequelizeDoctorStorage(sequelize);
const doctorService = new DoctorService(storage);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('doctorService:', () => {

  describe('getAll();', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getAll = jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Doctor_1',
          userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
          createdAt: '2021-09-09T06:09:51.000Z',
          updatedAt: '2021-09-09T06:09:51.000Z',
        },
      ]);

      const result = await doctorService.getAll();

      expect(storage.getAll).toBeCalled();
      expect(result[0].id).toEqual(1);
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(2);

      storage.getAll = jest.fn().mockResolvedValue([]);

      const result = await doctorService.getAll();

      expect(storage.getAll).toBeCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getByID(id);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getByID = jest.fn().mockResolvedValue({
        id: 1,
        name: 'Doctor_1',
        userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
        createdAt: '2021-09-09T06:09:51.000Z',
        updatedAt: '2021-09-09T06:09:51.000Z',
      });

      const result = await doctorService.getByID(1);

      expect(storage.getByID).toBeCalled();
      expect(result.id).toEqual(1);
    });

    test('should return undefined if no data found', async () => {
      expect.assertions(2);

      storage.getByID = jest.fn().mockResolvedValue(undefined);

      const result = await doctorService.getByID(5);

      expect(storage.getByID).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('getByUserID(userId);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getByUserID = jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Doctor_1',
          userId: 'a00bf660-10e0-11ec-8c60-d78305534610',
          createdAt: '2021-09-09T06:09:51.000Z',
          updatedAt: '2021-09-09T06:09:51.000Z',
        },
      ]);

      const result = await doctorService.getByUserID('a00bf660-10e0-11ec-8c60-d78305534610');

      expect(storage.getByUserID).toBeCalled();
      expect(result[0].id).toEqual(1);
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(2);

      storage.getByUserID = jest.fn().mockResolvedValue([]);

      const result = await doctorService.getByUserID('a00bf660-10e0-11ec-8c60-d78305534610');

      expect(storage.getByUserID).toBeCalled();
      expect(result).toEqual([]);
    });
  });
});
