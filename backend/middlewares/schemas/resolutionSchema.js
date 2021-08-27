export default {
  type: 'object',
  properties: {
    resolution: { type: 'string', maxLength: 400 },
    timeToLive: { type: 'integer' },
  },
  required: ['resolution'],
  additionalProperties: false,
};
