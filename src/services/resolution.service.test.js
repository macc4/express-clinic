import { ResolutionService } from './resolution.service.js';
import { SequelizeResolutionStorage } from '../db/sequelize.resolution.storage.js';
import sequelize from '../db/clients/sequelize.client.js';
import expiryUtils from '../utils/expiryUtils.js';
import dateUtils from '../utils/dateUtils.js';

const storage = new SequelizeResolutionStorage(sequelize);
const resolutionService = new ResolutionService(storage);

beforeEach(() => {
  jest.resetAllMocks();
});

describe('resolutionService:', () => {
  describe('create(body);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(3);

      const spyOne = jest.spyOn(storage, 'createOne').mockResolvedValue({
        id: 1,
        patientId: 1,
        resolution: 'test',
        expiry: -1,
        updatedAt: '2021-09-09T06:29:00.225Z',
        createdAt: '2021-09-09T06:29:00.225Z',
      });

      const spyTwo = jest.spyOn(expiryUtils, 'getUnixExpiry');

      const result = await resolutionService.create({
        patientId: 1,
        resolution: 'test',
        expiry: -1,
      });

      expect(spyOne).toHaveBeenCalled();
      expect(spyTwo).toHaveBeenCalled();
      expect(result.id).toEqual(1);

      spyOne.mockRestore();
      spyTwo.mockRestore();
    });

    test('should throw an error if non-existent patientId', async () => {
      expect.assertions(3);

      const spyOne = jest.spyOn(storage, 'createOne').mockImplementation(() => {
        throw new Error('Error Message');
      });

      const spyTwo = jest.spyOn(expiryUtils, 'getUnixExpiry');

      try {
        await resolutionService.create({
          patientId: 666,
          resolution: 'test',
          expiry: -1,
        });
      } catch (error) {
        expect(spyOne).toHaveBeenCalled();
        expect(spyTwo).toHaveBeenCalled();
        expect(error.message).toEqual('Error Message');
      }

      spyOne.mockRestore();
      spyTwo.mockRestore();
    });
  });

  describe('getAll(query);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      const spyOne = jest.spyOn(storage, 'getAll').mockResolvedValue([
        {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: -1,
          updatedAt: '2021-09-09T06:29:00.225Z',
          createdAt: '2021-09-09T06:29:00.225Z',
        },
      ]);

      const query = {};

      const result = await resolutionService.getAll(query);

      expect(spyOne).toHaveBeenCalled();
      expect(result[0].id).toEqual(1);

      spyOne.mockRestore();
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(2);

      const spyOne = jest.spyOn(storage, 'getAll').mockResolvedValue([]);

      const query = {};

      const result = await resolutionService.getAll(query);

      expect(spyOne).toHaveBeenCalled();
      expect(result).toEqual([]);

      spyOne.mockRestore();
    });
  });

  describe('getByUserID(id);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      const spyOne = jest.spyOn(storage, 'getByUserID').mockResolvedValue([
        {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: -1,
          createdAt: '2021-09-09T06:43:53.000Z',
          updatedAt: '2021-09-09T06:43:53.000Z',
        },
      ]);

      const result = await resolutionService.getByUserID(
        'a67dcf70-1133-11ec-8da9-d142e5deed6f',
      );

      expect(spyOne).toHaveBeenCalled();
      expect(result[0].id).toEqual(1);

      spyOne.mockRestore();
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(3);

      const spyOne = jest.spyOn(storage, 'getByUserID').mockResolvedValue([]);

      const spyTwo = jest.spyOn(
        resolutionService,
        'filterResolutionsArrayByExpiry',
      );
      const result = await resolutionService.getByUserID(
        'a67dcf70-1133-11ec-8da9-d142e5deed6f',
      );

      expect(spyOne).toHaveBeenCalled();
      expect(spyTwo).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);

      spyOne.mockRestore();
      spyTwo.mockRestore();
    });
  });

  describe('getByPatientName(name);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      const spyOne = jest.spyOn(storage, 'getByPatientName').mockResolvedValue([
        {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: -1,
          createdAt: '2021-09-09T06:43:53.000Z',
          updatedAt: '2021-09-09T06:43:53.000Z',
        },
      ]);

      const result = await resolutionService.getByPatientName('test');

      expect(spyOne).toHaveBeenCalled();
      expect(result[0].id).toEqual(1);

      spyOne.mockRestore();
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(3);

      const spyOne = jest
        .spyOn(storage, 'getByPatientName')
        .mockResolvedValue([]);

      const spyTwo = jest.spyOn(
        resolutionService,
        'filterResolutionsArrayByExpiry',
      );

      const result = await resolutionService.getByPatientName('test');

      expect(spyOne).toHaveBeenCalled();
      expect(spyTwo).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);

      spyOne.mockRestore();
      spyTwo.mockRestore();
    });
  });

  describe('getByID(id);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(3);

      const spyOne = jest.spyOn(storage, 'getByID').mockResolvedValue({
        id: 1,
        patientId: 1,
        resolution: 'test',
        expiry: -1,
        createdAt: '2021-09-09T06:43:53.000Z',
        updatedAt: '2021-09-09T06:43:53.000Z',
      });

      const spyTwo = jest
        .spyOn(resolutionService, 'checkForNotExpiredOrDelete')
        .mockResolvedValue(true);

      const result = await resolutionService.getByID(1);

      expect(spyOne).toHaveBeenCalled();
      expect(spyTwo).toHaveBeenCalled();
      expect(result.id).toEqual(1);

      spyOne.mockRestore();
      spyTwo.mockRestore();
    });

    test('should return undefined if no data found', async () => {
      expect.assertions(3);

      const spyOne = jest
        .spyOn(storage, 'getByID')
        .mockResolvedValue(undefined);

      const spyTwo = jest.spyOn(
        resolutionService,
        'checkForNotExpiredOrDelete',
      );

      const result = await resolutionService.getByID(1);

      expect(spyOne).toHaveBeenCalled();
      expect(spyTwo).toHaveBeenCalledTimes(0);
      expect(result).toEqual(undefined);

      spyOne.mockRestore();
      spyTwo.mockRestore();
    });
  });

  describe('deleteByID(id);', () => {
    test('should return 1 if successful (sequelize-specific test)', async () => {
      expect.assertions(2);

      const spyOne = jest.spyOn(storage, 'deleteByID').mockResolvedValue(1);

      const result = await resolutionService.deleteByID(1);

      expect(storage.deleteByID).toHaveBeenCalled();
      expect(result).toEqual(1);

      spyOne.mockRestore();
    });

    test('should return 0 if failed (sequelize-specific test)', async () => {
      expect.assertions(2);

      const spyOne = jest.spyOn(storage, 'deleteByID').mockResolvedValue(0);

      const result = await resolutionService.deleteByID(1);

      expect(storage.deleteByID).toHaveBeenCalled();
      expect(result).toEqual(0);

      spyOne.mockRestore();
    });
  });

  describe('TTL logic:', () => {
    describe('checkForNotExpiredOrDelete(resolution);', () => {
      test('should return false === expired', async () => {
        expect.assertions(2);

        const resolution = {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: dateUtils.getUnixOneMin().getTime(), // expiry is set in 1 minute from now
          createdAt: '2021-09-09T06:43:53.000Z',
          updatedAt: '2021-09-09T06:43:53.000Z',
        };

        const spyOne = jest.spyOn(storage, 'deleteByID').mockResolvedValue(1);

        // mocking Date.now() here so the "resolution" object above would have the correct date
        const currentDate = Date.now();
        const spyTwo = jest
          .spyOn(Date, 'now')
          .mockImplementation(() => +new Date(currentDate + 3600000)); // mock Date.now() to 1 hour from now

        const notExpired = await resolutionService.checkForNotExpiredOrDelete(
          resolution,
        );

        expect(spyOne).toHaveBeenCalledTimes(1);
        expect(notExpired).toEqual(false);

        spyOne.mockRestore();
        spyTwo.mockRestore();
      });

      test('should return true === not expired', async () => {
        expect.assertions(2);

        const resolution = {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: dateUtils.getUnixOneMin().getTime(), // expiry is set in 1 minute from now
          createdAt: '2021-09-09T06:43:53.000Z',
          updatedAt: '2021-09-09T06:43:53.000Z',
        };

        const spyOne = jest.spyOn(storage, 'deleteByID');

        const notExpired = await resolutionService.checkForNotExpiredOrDelete(
          resolution,
        );

        expect(spyOne).toHaveBeenCalledTimes(0);
        expect(notExpired).toEqual(true);

        spyOne.mockRestore();
      });
    });

    describe('filterResolutionsArrayByExpiry(resolutions);', () => {
      test('should return a filtered array without expired resolutions and call storage.deleteById once', async () => {
        expect.assertions(2);

        const resolutions = [
          {
            id: 1,
            patientId: 1,
            resolution: 'test',
            expiry: -1, // expiry turned off
            createdAt: '2021-09-09T06:43:53.000Z',
            updatedAt: '2021-09-09T06:43:53.000Z',
          },
          {
            id: 2,
            patientId: 1,
            resolution: 'test',
            expiry: Date.now() - 3600000, // 1 hour back
            createdAt: '2021-09-09T06:43:53.000Z',
            updatedAt: '2021-09-09T06:43:53.000Z',
          },
          {
            id: 3,
            patientId: 1,
            resolution: 'test',
            expiry: Date.now() + 3600000, // 1 hour from now
            createdAt: '2021-09-09T06:43:53.000Z',
            updatedAt: '2021-09-09T06:43:53.000Z',
          },
        ];

        const spyOne = jest.spyOn(storage, 'deleteByID').mockImplementation();

        const result = await resolutionService.filterResolutionsArrayByExpiry(
          resolutions,
        );

        expect(spyOne).toHaveBeenCalledTimes(1);
        expect(result).toEqual([
          {
            id: 1,
            patientId: 1,
            resolution: 'test',
            expiry: -1, // expiry turned off
            createdAt: '2021-09-09T06:43:53.000Z',
            updatedAt: '2021-09-09T06:43:53.000Z',
          },
          {
            id: 3,
            patientId: 1,
            resolution: 'test',
            expiry: Date.now() + 3600000, // 1 hour from now
            createdAt: '2021-09-09T06:43:53.000Z',
            updatedAt: '2021-09-09T06:43:53.000Z',
          },
        ]);

        spyOne.mockRestore();
      });
    });
  });
});
