import { UserService } from './user.service.js';
import { SequelizeUserStorage } from '../db/sequelize.user.storage.js';
import sequelize from '../db/clients/sequelize.client.js';
import passwordUtils from '../utils/passwordUtils.js';

const storage = new SequelizeUserStorage(sequelize);
const userService = new UserService(storage);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('userService:', () => {
  describe('create(body);', () => {
    test('should return back data (with id and patient role, without a password) if successful and no role specified', async () => {
      expect.assertions(3);

      storage.createOne = jest.fn().mockResolvedValue({
        id: 'a67dcf70-1133-11ec-8da9-d142e5deed6f',
        name: 'Edward',
        email: 'test@gmail.com',
        role: 'patient',
      });
      passwordUtils.hashPassword = jest.fn();

      const result = await userService.create({
        name: 'Edward',
        email: 'test@gmail.com',
        password: '12345678',
      });

      expect(storage.createOne).toBeCalled();
      expect(passwordUtils.hashPassword).toBeCalled();
      expect(result.id).toEqual('a67dcf70-1133-11ec-8da9-d142e5deed6f');
    });

    test('should return back data (with id and doctor/admin role, without a password) if successful and role was specified', async () => {
      expect.assertions(3);

      storage.createOne = jest.fn().mockResolvedValue({
        id: 'a67dcf70-1133-11ec-8da9-d142e5deed6f',
        name: 'Edward',
        email: 'test@gmail.com',
        role: 'admin',
      });
      passwordUtils.hashPassword = jest.fn();

      const result = await userService.create({
        name: 'Edward',
        email: 'test@gmail.com',
        password: '12345678',
        role: 'admin',
      });

      expect(storage.createOne).toBeCalled();
      expect(passwordUtils.hashPassword).toBeCalled();
      expect(result.id).toEqual('a67dcf70-1133-11ec-8da9-d142e5deed6f');
    });

    test('should throw an error if duplicate email or non-existent role', async () => {
      expect.assertions(3);

      storage.createOne = jest.fn().mockImplementation(() => {
        throw new Error('Error Message');
      });

      try {
        await userService.create({
          name: 'Edward',
          email: 'DUPLICATE@gmail.com',
          password: '12345678',
          role: 'NON-EXISTENT ROLE',
        });
      } catch (error) {
        expect(storage.createOne).toBeCalled();
        expect(passwordUtils.hashPassword).toBeCalled();
        expect(error.message).toEqual('Error Message');
      }
    });
  });

  describe('getAll(query);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getAll = jest.fn().mockResolvedValue([
        {
          id: '8b15b530-1134-11ec-bb5d-5ffab4da9399',
          role: 'admin',
          name: 'Edward',
          email: 'test@gmail.com',
          createdAt: '2021-09-09T06:09:51.000Z',
          updatedAt: '2021-09-09T06:09:51.000Z',
        },
      ]);

      const query = {};

      const result = await userService.getAll(query);

      expect(storage.getAll).toBeCalled();
      expect(result[0].id).toEqual('8b15b530-1134-11ec-bb5d-5ffab4da9399');
    });

    test('should return an empty array if no data found', async () => {
      expect.assertions(2);

      storage.getAll = jest.fn().mockResolvedValue([]);

      const query = {};

      const result = await userService.getAll(query);

      expect(storage.getAll).toBeCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getByEmail(email);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getByEmail = jest.fn().mockResolvedValue({
        id: '8b15b530-1134-11ec-bb5d-5ffab4da9399',
        role: 'admin',
        name: 'Edward',
        email: 'test@gmail.com',
        createdAt: '2021-09-09T06:09:51.000Z',
        updatedAt: '2021-09-09T06:09:51.000Z',
      });

      const result = await userService.getByEmail('test@gmail.com');

      expect(storage.getByEmail).toBeCalled();
      expect(result.id).toEqual('8b15b530-1134-11ec-bb5d-5ffab4da9399');
    });

    test('should return undefined if no data found', async () => {
      expect.assertions(2);

      storage.getByEmail = jest.fn().mockResolvedValue();

      const result = await userService.getByEmail('test@gmail.com');

      expect(storage.getByEmail).toBeCalled();
      expect(result).toEqual();
    });
  });

  describe('getByID(id);', () => {
    test('should return back data if successful', async () => {
      expect.assertions(2);

      storage.getByID = jest.fn().mockResolvedValue({
        id: '8b15b530-1134-11ec-bb5d-5ffab4da9399',
        role: 'admin',
        name: 'Edward',
        email: 'test@gmail.com',
        createdAt: '2021-09-09T06:09:51.000Z',
        updatedAt: '2021-09-09T06:09:51.000Z',
      });

      const result = await userService.getByID(
        '8b15b530-1134-11ec-bb5d-5ffab4da9399',
      );

      expect(storage.getByID).toBeCalled();
      expect(result.id).toEqual('8b15b530-1134-11ec-bb5d-5ffab4da9399');
    });

    test('should return undefined if no data found', async () => {
      expect.assertions(2);

      storage.getByID = jest.fn().mockResolvedValue(undefined);

      const result = await userService.getByID(
        '8b15b530-1134-11ec-bb5d-5ffab4da9399',
      );

      expect(storage.getByID).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('deleteByID(id);', () => {
    test('should return 1 if successful (sequelize-specific test)', async () => {
      expect.assertions(2);

      storage.deleteByID = jest.fn().mockResolvedValue(1);

      const result = await userService.deleteByID(
        '8b15b530-1134-11ec-bb5d-5ffab4da9399',
      );

      expect(storage.deleteByID).toBeCalled();
      expect(result).toEqual(1);
    });

    test('should return 0 if failed (sequelize-specific test)', async () => {
      expect.assertions(2);

      storage.deleteByID = jest.fn().mockResolvedValue(0);

      const result = await userService.deleteByID(
        '8b15b530-1134-11ec-bb5d-5ffab4da9399',
      );

      expect(storage.deleteByID).toBeCalled();
      expect(result).toEqual(0);
    });
  });
});
