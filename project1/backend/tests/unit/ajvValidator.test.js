import ajvValidator from '../../middlewares/ajvValidator.js';
import queueSchema from '../../schemas/queueSchema.js';
import resolutionSchema from '../../schemas/resolutionSchema.js';

const queueRequests = [
  { timeToLive: -1 },

  { name: 'e', timeToLive: -1 },
  { name: 'edward cullennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn', timeToLive: -1 },
  { name: 'edward cullen', timeToLive: '-1' },
  { name: 55, timeToLive: -1 },
];

const resolutionRequests = [
  { name: 'edward cullen', resolution: 'He is a vampire!' },
  { name: 'edward cullen', expiry: -1 },
  { resolution: 'He is a vampire!', expiry: -1 },
  { name: 22, resolution: 'He is a vampire!', expiry: -1 },
  { name: 'E', resolution: 'He is a vampire!', expiry: -1 },
  {
    name: 'Edward Cullennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
    resolution: 'He is a vampire!',
    expiry: -1,
  },
  { name: 'Edward Cullen', resolution: 22, expiry: -1 },
  { name: 'Edward Cullen', resolution: null, expiry: -1 },
  { name: 'Edward Cullen', resolution: {}, expiry: -1 },
  { name: 'Edward Cullen', resolution: [], expiry: -1 },
  { name: 'Edward Cullen', resolution: 'He is a vampire!', expiry: '-1' },
];

describe('POST api/v1/queue --- testing validation middleware, it:', () => {
  it(`doesn't throw errors with the right input;`, () => {
    expect(() => {
      ajvValidator({ name: 'edward cullen' }, queueSchema);
    }).not.toThrow();
  });

  queueRequests.forEach((element) => {
    it('throws specific error with the wrong input;', () => {
      expect(() => {
        ajvValidator(element, queueSchema);
      }).toThrow(/ValidationError/);
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
    it('throws specific error with the wrong input;', () => {
      expect(() => {
        ajvValidator(element, resolutionSchema);
      }).toThrow(/ValidationError/);
    });
  });
});
