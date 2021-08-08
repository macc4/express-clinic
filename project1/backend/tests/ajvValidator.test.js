import ajvValidator from '../utils/ajvValidator';
import queueSchema from '../schemas/queueSchema';
import resolutionSchema from '../schemas/resolutionSchema';

const queueRequests = [
  [
    { name: 'edward cullen' },
    `Invalid input data - must have required property 'timeToLive'`,
  ],
  [{ timeToLive: -1 }, `Invalid input data - must have required property 'name'`],
  [
    { name: 'e', timeToLive: -1 },
    `Invalid input data - field 'name' must NOT have fewer than 2 characters`,
  ],
  [
    { name: 'edward cullennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn', timeToLive: -1 },
    `Invalid input data - field 'name' must NOT have more than 20 characters`,
  ],
  [
    { name: 'edward cullen', timeToLive: '-1' },
    `Invalid input data - field 'timeToLive' must be integer`,
  ],
  [{ name: 55, timeToLive: -1 }, `Invalid input data - field 'name' must be string`],
];

const resolutionRequests = [
  [
    { name: 'edward cullen', resolution: 'He is a vampire!' },
    `Invalid input data - must have required property 'expiry'`,
  ],
  [
    { name: 'edward cullen', expiry: -1 },
    `Invalid input data - must have required property 'resolution'`,
  ],
  [
    { resolution: 'He is a vampire!', expiry: -1 },
    `Invalid input data - must have required property 'name'`,
  ],
  [
    { name: 22, resolution: 'He is a vampire!', expiry: -1 },
    `Invalid input data - field 'name' must be string`,
  ],
  [
    { name: 'E', resolution: 'He is a vampire!', expiry: -1 },
    `Invalid input data - field 'name' must NOT have fewer than 2 characters`,
  ],
  [
    {
      name: 'Edward Cullennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
      resolution: 'He is a vampire!',
      expiry: -1,
    },
    `Invalid input data - field 'name' must NOT have more than 20 characters`,
  ],
  [
    { name: 'Edward Cullen', resolution: 22, expiry: -1 },
    `Invalid input data - field 'resolution' must be string`,
  ],
  [
    { name: 'Edward Cullen', resolution: null, expiry: -1 },
    `Invalid input data - field 'resolution' must be string`,
  ],
  [
    { name: 'Edward Cullen', resolution: {}, expiry: -1 },
    `Invalid input data - field 'resolution' must be string`,
  ],
  [
    { name: 'Edward Cullen', resolution: [], expiry: -1 },
    `Invalid input data - field 'resolution' must be string`,
  ],
  [
    { name: 'Edward Cullen', resolution: 'He is a vampire!', expiry: '-1' },
    `Invalid input data - field 'expiry' must be integer`,
  ],
];

describe('POST api/v1/queue --- testing validation middleware, it:', () => {
  it(`doesn't throw errors with the right input;`, () => {
    expect(() => {
      ajvValidator({ name: 'edward cullen', timeToLive: -1 }, queueSchema);
    }).not.toThrow();
  });

  queueRequests.forEach((element) => {
    test('throws specific error with the wrong input;', () => {
      expect(() => {
        ajvValidator(element[0], queueSchema);
      }).toThrow(element[1]);
    });
  });
});

describe('POST api/v1/resolutions --- testing validation middleware, it:', () => {
  it(`doesn't throw errors with the right input;`, () => {
    expect(() => {
      ajvValidator(
        { name: 'Edward Cullen', resolution: 'He is a vampire!', expiry: -1 },
        resolutionSchema
      );
    }).not.toThrow();
  });

  resolutionRequests.forEach((element) => {
    test('throws specific error with the wrong input;', () => {
      expect(() => {
        ajvValidator(element[0], resolutionSchema);
      }).toThrow(element[1]);
    });
  });
});
