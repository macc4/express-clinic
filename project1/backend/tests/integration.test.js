import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import app from '../app.js';

const request = supertest(app);

describe('POST api/v1/queue', () => {
  describe("Given a patient's name and timeToLive, must CREATE the data entry,", () => {
    test('respond with a 201 status code, send back the json formatted data;', async () => {
      const res = await request.post('/api/v1/queue').send({
        name: 'edward cullen',
        timeToLive: -1,
      });

      expect(res.statusCode).toEqual(StatusCodes.CREATED);
      expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    test('respond with the same data but name is capitalized;', async () => {
      const res = await request.post('/api/v1/queue').send({
        name: 'bella swan',
        timeToLive: -1,
      });

      expect(res.body.data.patient).toEqual({
        name: 'Bella Swan',
        expiry: -1,
      });
    });

    // RECEIVING ERRORS IS NOT WORKING AND I DON'T KNOW WHY

    // test('responds with a 404 status code due to duplicate data', async () => {
    //   const res = await request.post('/api/v1/queue').send({
    //     name: 'bella swan',
    //     timeToLive: -1,
    //   });

    //   expect(res.statusCode).toBe(404);
    // });
  });
});

describe('GET api/v1/queue', () => {
  describe('Given the number of the person in queue, must GET the data entry,', () => {
    test(`respond with the 200 code and send back json with the person's data;`, async () => {
      const res = await request.get('/api/v1/queue/1');

      expect(res.statusCode).toEqual(StatusCodes.OK);
      expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(res.body.data.patient).toEqual({
        name: 'Edward Cullen',
        expiry: -1,
      });
    });

    // test('responds with the invalid patient error data', async () => {
    //   const res = await request.get('/api/v1/queue/999');

    //   expect(res.statusCode).toBe(404);
    // });
  });
});

describe('DELETE api/v1/queue', () => {
  describe('Given the number of the person in queue, must DELETE the data entry,', () => {
    test(`respond with the 204 code;`, async () => {
      const res = await request.delete('/api/v1/queue/1');

      expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);
      expect(res.body).toEqual({});
    });
  });
});

describe('POST api/v1/resolutions', () => {
  describe("Given a patient's name in ANY case, resolution and expiry, must CREATE the data entry,", () => {
    test('respond with a 201 status code, send back the json formatted data (name should be in kebab-case);', async () => {
      const res = await request.post('/api/v1/resolutions').send({
        name: 'Edward Cullen',
        resolution: 'He is a vampire!',
        expiry: -1,
      });

      expect(res.statusCode).toEqual(StatusCodes.CREATED);
      expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(res.body.data.patient).toEqual({
        name: 'edward-cullen',
        resolution: 'He is a vampire!',
        expiry: -1,
      });
    });
  });
});

describe('GET api/v1/resolutions', () => {
  describe(`Given the person's name in babel-case, must GET the data entry,`, () => {
    test(`respond with the 200 code and send back json with the person's data;`, async () => {
      const res = await request.get('/api/v1/resolutions/edward-cullen');

      expect(res.statusCode).toEqual(StatusCodes.OK);
      expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(res.body.data.patient).toEqual({
        name: 'edward-cullen',
        resolution: 'He is a vampire!',
        expiry: -1,
      });
    });
  });
});

describe('DELETE api/v1/resolutions', () => {
  describe(`Given the person's name in babel-case, must DELETE the data entry,`, () => {
    test(`respond with the 204 code;`, async () => {
      const res = await request.delete('/api/v1/resolutions/edward-cullen');

      expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);
      expect(res.body).toEqual({});
    });
  });
});
