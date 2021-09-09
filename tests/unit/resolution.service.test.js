import { ResolutionService } from '../../src/services/resolution.service.js';
import { SequelizeResolutionStorage } from '../../src/db/sequelize.resolution.storage.js';
import sequelize from '../../src/db/clients/sequelize.client.js';
import expiryUtils from '../../src/utils/expiryUtils.js';
import dateUtils from '../../src/utils/dateUtils.js';

const storage = new SequelizeResolutionStorage(sequelize);
const resolutionService = new ResolutionService(storage);

const checkForNotExpiredOrDeleteBackup =
  resolutionService.checkForNotExpiredOrDelete;

const DateBackup = Date.now;

const filterResolutionsArrayByExpiryBackup =
  resolutionService.filterResolutionsArrayByExpiry;

beforeEach(() => {
  // not working??
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('resolutionService:', () => {
  describe('create(body);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(3);

      storage.createOne = jest.fn().mockResolvedValue({
        id: 1,
        patientId: 1,
        resolution: 'test',
        expiry: -1,
        updatedAt: '2021-09-09T06:29:00.225Z',
        createdAt: '2021-09-09T06:29:00.225Z',
      });
      expiryUtils.getUnixExpiry = jest.fn();

      const result = await resolutionService.create({
        patientId: 1,
        resolution: 'test',
        expiry: -1,
      });

      expect(storage.createOne).toBeCalled();
      expect(expiryUtils.getUnixExpiry).toBeCalled();
      expect(result.id).toEqual(1);
    });

    test('should throw an error if non-existent patientId', async () => {
      expect.assertions(3);

      storage.createOne = jest.fn().mockImplementation(() => {
        throw new Error('Error Message');
      });

      try {
        await resolutionService.create({
          patientId: 666,
          resolution: 'test',
          expiry: -1,
        });
      } catch (error) {
        expect(storage.createOne).toBeCalled();
        expect(expiryUtils.getUnixExpiry).toBeCalled();
        expect(error.message).toEqual('Error Message');
      }
    });
  });

  describe('getAll(query);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(3);

      storage.getAll = jest.fn().mockResolvedValue([
        {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: -1,
          updatedAt: '2021-09-09T06:29:00.225Z',
          createdAt: '2021-09-09T06:29:00.225Z',
        },
      ]);
      resolutionService.filterResolutionsArrayByExpiry = jest
        .fn()
        .mockImplementation(resolutions => resolutions);

      const query = {};

      const result = await resolutionService.getAll(query);

      expect(storage.getAll).toBeCalled();
      expect(resolutionService.filterResolutionsArrayByExpiry).toBeCalled();
      expect(result[0].id).toEqual(1);
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(3);

      storage.getAll = jest.fn().mockResolvedValue([]);
      resolutionService.filterResolutionsArrayByExpiry = jest.fn();

      const query = {};

      const result = await resolutionService.getAll(query);

      expect(storage.getAll).toBeCalled();
      expect(
        resolutionService.filterResolutionsArrayByExpiry,
      ).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });
  });

  describe('getByUserID(id);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(3);

      storage.getByUserID = jest.fn().mockResolvedValue([
        {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: -1,
          createdAt: '2021-09-09T06:43:53.000Z',
          updatedAt: '2021-09-09T06:43:53.000Z',
        },
      ]);
      resolutionService.filterResolutionsArrayByExpiry = jest
        .fn()
        .mockImplementation(resolutions => resolutions);

      const result = await resolutionService.getByUserID(
        'a67dcf70-1133-11ec-8da9-d142e5deed6f',
      );

      expect(storage.getByUserID).toBeCalled();
      expect(resolutionService.filterResolutionsArrayByExpiry).toBeCalled();
      expect(result[0].id).toEqual(1);
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(3);

      storage.getByUserID = jest.fn().mockResolvedValue([]);
      resolutionService.filterResolutionsArrayByExpiry = jest.fn();

      const result = await resolutionService.getByUserID(
        'a67dcf70-1133-11ec-8da9-d142e5deed6f',
      );

      expect(storage.getByUserID).toBeCalled();
      expect(
        resolutionService.filterResolutionsArrayByExpiry,
      ).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });
  });

  describe('getByPatientName(name);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(3);

      storage.getByPatientName = jest.fn().mockResolvedValue([
        {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: -1,
          createdAt: '2021-09-09T06:43:53.000Z',
          updatedAt: '2021-09-09T06:43:53.000Z',
        },
      ]);
      resolutionService.filterResolutionsArrayByExpiry = jest
        .fn()
        .mockImplementation(resolutions => resolutions);

      const result = await resolutionService.getByPatientName('test');

      expect(storage.getByPatientName).toBeCalled();
      expect(resolutionService.filterResolutionsArrayByExpiry).toBeCalled();
      expect(result[0].id).toEqual(1);
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(3);

      storage.getByPatientName = jest.fn().mockResolvedValue([]);
      resolutionService.filterResolutionsArrayByExpiry = jest.fn();

      const result = await resolutionService.getByPatientName('test');

      expect(storage.getByPatientName).toBeCalled();
      expect(
        resolutionService.filterResolutionsArrayByExpiry,
      ).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });
  });

  describe('getByID(id);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(3);

      storage.getByID = jest.fn().mockResolvedValue({
        id: 1,
        patientId: 1,
        resolution: 'test',
        expiry: -1,
        createdAt: '2021-09-09T06:43:53.000Z',
        updatedAt: '2021-09-09T06:43:53.000Z',
      });
      resolutionService.checkForNotExpiredOrDelete = jest
        .fn()
        .mockResolvedValue(true);

      const result = await resolutionService.getByID(1);

      expect(storage.getByID).toBeCalled();
      expect(resolutionService.checkForNotExpiredOrDelete).toBeCalled();
      expect(result.id).toEqual(1);
    });

    test('should return undefined if no data found', async () => {
      expect.assertions(3);

      storage.getByID = jest.fn().mockResolvedValue(undefined);
      resolutionService.checkForNotExpiredOrDelete = jest.fn();

      const result = await resolutionService.getByID(1);

      expect(storage.getByID).toBeCalled();
      expect(
        resolutionService.checkForNotExpiredOrDelete,
      ).toHaveBeenCalledTimes(0);
      expect(result).toEqual(undefined);
    });
  });

  describe('deleteByID(id);', () => {
    test('should return 1 if successful (sequelize-specific test)', async () => {
      expect.assertions(2);

      storage.deleteByID = jest.fn().mockResolvedValue(1);

      const result = await resolutionService.deleteByID(1);

      expect(storage.deleteByID).toBeCalled();
      expect(result).toEqual(1);
    });

    test('should return 0 if failed (sequelize-specific test)', async () => {
      expect.assertions(2);

      storage.deleteByID = jest.fn().mockResolvedValue(0);

      const result = await resolutionService.deleteByID(1);

      expect(storage.deleteByID).toBeCalled();
      expect(result).toEqual(0);
    });
  });

  describe('TTL logic:', () => {
    describe('checkForNotExpiredOrDelete(resolution);', () => {
      test('should return false === expired', async () => {
        expect.assertions(2);

        // the mocks somehow do not reset, so getting the value from a backup
        Date.now = DateBackup;

        const resolution = {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: dateUtils.getUnixOneMin().getTime(), // expiry is set in 1 minute
          createdAt: '2021-09-09T06:43:53.000Z',
          updatedAt: '2021-09-09T06:43:53.000Z',
        };

        // set current date in the future
        Date.now = jest.fn(() => +new Date('2030-01-01'));

        resolutionService.checkForNotExpiredOrDelete =
          checkForNotExpiredOrDeleteBackup;

        const notExpired = await resolutionService.checkForNotExpiredOrDelete(
          resolution,
        );

        expect(storage.deleteByID).toHaveBeenCalledTimes(1);
        expect(notExpired).toEqual(false);
      });

      test('should return true === not expired', async () => {
        expect.assertions(2);

        // the mocks somehow do not reset, so getting the value from a backup
        Date.now = DateBackup;

        const resolution = {
          id: 1,
          patientId: 1,
          resolution: 'test',
          expiry: dateUtils.getUnixOneMin().getTime(), // expiry is set in 1 minute
          createdAt: '2021-09-09T06:43:53.000Z',
          updatedAt: '2021-09-09T06:43:53.000Z',
        };

        resolutionService.checkForNotExpiredOrDelete =
          checkForNotExpiredOrDeleteBackup;

        const notExpired = await resolutionService.checkForNotExpiredOrDelete(
          resolution,
        );

        expect(storage.deleteByID).toHaveBeenCalledTimes(0);
        expect(notExpired).toEqual(true);
      });
    });

    describe('filterResolutionsArrayByExpiry(resolutions);', () => {
      test('should return a filtered array without expired resolutions and call storage.deleteById once', async () => {
        // expect.assertions(3);

        Date.now = DateBackup;
        resolutionService.filterResolutionsArrayByExpiry =
          filterResolutionsArrayByExpiryBackup;
        resolutionService.checkForNotExpiredOrDelete =
          checkForNotExpiredOrDeleteBackup;

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
            expiry: 100, // (ms), obviously expired
            createdAt: '2021-09-09T06:43:53.000Z',
            updatedAt: '2021-09-09T06:43:53.000Z',
          },
          {
            id: 3,
            patientId: 1,
            resolution: 'test',
            expiry: 20311749563550, // (ms), not expired
            createdAt: '2021-09-09T06:43:53.000Z',
            updatedAt: '2021-09-09T06:43:53.000Z',
          },
        ];

        const result = await resolutionService.filterResolutionsArrayByExpiry(
          resolutions,
        );

        expect(storage.deleteByID).toHaveBeenCalledTimes(1);
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
            expiry: 20311749563550, // (ms), not expired expired
            createdAt: '2021-09-09T06:43:53.000Z',
            updatedAt: '2021-09-09T06:43:53.000Z',
          },
        ]);
      });
    });
  });
});
