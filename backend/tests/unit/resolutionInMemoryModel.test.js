import { ResolutionFactory } from '../../models/resolutionFactory.js';

const resolutionFactory = new ResolutionFactory('in-memory');
const resolutionModel = resolutionFactory.create();

const requests = [
  {
    name: 'Edward Cullen',
    resolution: 'He is a vampire!',
  },
  {
    name: 'bella Swan',
    resolution: 'She is a human!',
    timeToLive: 1,
  },
  {
    name: 'Jacob Black',
    resolution: 'He is a werewolf!',
    timeToLive: 5,
  },
];

describe('resolution model (in-memory) --->', () => {
  describe('1) create', () => {
    it('returns the patient object with the correct data', async () => {
      expect.assertions(3);
      const res = await resolutionModel.create(requests[0]);

      expect(res.key).toEqual('edward-cullen');
      expect(res.name).toEqual('Edward Cullen');
      expect(res.resolutions[0].resolution).toEqual('He is a vampire!');
    });
    it('returns the same patient, but with 2 resolutions now', async () => {
      expect.assertions(3);
      const res = await resolutionModel.create(requests[0]);

      expect(res.key).toEqual('edward-cullen');
      expect(res.name).toEqual('Edward Cullen');
      expect(res.resolutions[1].resolution).toEqual('He is a vampire!');
    });
    it('returns the patient object with the correct data', async () => {
      expect.assertions(3);
      const res = await resolutionModel.create(requests[2]);

      expect(res.key).toEqual('jacob-black');
      expect(res.name).toEqual('Jacob Black');
      expect(res.resolutions[0].resolution).toEqual('He is a werewolf!');
    });
  });

  describe('2) get', () => {
    it('(edward-cullen) -> returns the correct data of the patient', async () => {
      expect.assertions(4);
      const res = await resolutionModel.get(requests[0].name);

      expect(res.key).toEqual('edward-cullen');
      expect(res.name).toEqual('Edward Cullen');
      expect(res.resolutions[0].resolution).toEqual('He is a vampire!');
      expect(res.resolutions[1].resolution).toEqual('He is a vampire!');
    });
    it('(bella-swan) -> returns undefined due to missing key', async () => {
      expect.assertions(1);
      const res = await resolutionModel.get(requests[1].name);
      expect(res).toEqual(undefined);
    });
  });

  describe('3) delete', () => {
    it('(edward-cullen) -> returns the correct data of the deleted patient', async () => {
      expect.assertions(4);
      const res = await resolutionModel.delete('edward-cullen');

      expect(res.key).toEqual('edward-cullen');
      expect(res.name).toEqual('Edward Cullen');
      expect(res.resolutions[0].resolution).toEqual('He is a vampire!');
      expect(res.resolutions[1].resolution).toEqual('He is a vampire!');
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
      const res = await resolutionModel.get(requests[0].name);
      expect(res).toEqual(undefined);
    });
    it('(jacob-black) -> returns the correct data of the patient', async () => {
      expect.assertions(3);
      const res = await resolutionModel.get(requests[2].name);

      expect(res.key).toEqual('jacob-black');
      expect(res.name).toEqual('Jacob Black');
      expect(res.resolutions[0].resolution).toEqual('He is a werewolf!');
    });
  });
});
