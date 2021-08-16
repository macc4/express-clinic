import resolutionModel from '../../models/resolutionModel.js';
import { redisClient } from '../../db/redis.js';

redisClient.flushall();

const body = { name: 'edward-cullen', resolution: 'He is a vampire', expiry: -1 };

describe('1) create', () => {
  it('returns the patient object with the correct data', async () => {
    expect.assertions(1);
    const res = await resolutionModel.create(body);
    expect(res).toEqual({
      name: 'edward-cullen',
      resolution: 'He is a vampire',
      expiry: -1,
    });
  });
  it('returns an error because we try adding the same patient to the database', async () => {
    expect.assertions(1);
    try {
      await resolutionModel.create(body);
    } catch (e) {
      expect(e.message).toEqual('Database already contains this data.');
    }
  });
  it('returns an error because we try adding the same patient to the database', async () => {
    expect.assertions(1);
    try {
      await resolutionModel.create(body);
    } catch (e) {
      expect(e.message).toEqual('Database already contains this data.');
    }
  });
});

describe('2) get', () => {
  it('(edward-cullen) returns the correct data of the patient', async () => {
    expect.assertions(1);
    const res = await resolutionModel.get('edward-cullen');
    expect(res).toEqual({
      name: 'Edward Cullen',
      resolution: 'He is a vampire',
      expiry: -1,
    });
  });
  it('(bella-swan) returns undefined due to missing key', async () => {
    expect.assertions(1);
    const res = await resolutionModel.get('bella-swan');
    expect(res).toEqual(undefined);
  });
});

describe('3) delete', () => {
  it('(edward-cullen) -> returns the correct data of the patient deleted patient', async () => {
    expect.assertions(1);
    const res = await resolutionModel.delete('edward-cullen');
    expect(res).toEqual({
      name: 'edward-cullen',
      resolution: 'He is a vampire',
      expiry: -1,
    });
  });
  it('(bella-swan) -> returns undefined due to missing key', async () => {
    expect.assertions(1);
    const res = await resolutionModel.delete('bella-swan');
    expect(res).toEqual(undefined);
  });
});

describe('4) get', () => {
  it('(edward-cullen) -> returns undefined due to missing key', async () => {
    expect.assertions(1);
    const res = await resolutionModel.delete('edward-cullen');
    expect(res).toEqual(undefined);
  });
});
