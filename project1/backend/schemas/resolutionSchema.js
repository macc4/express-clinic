export default {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 20 },
    resolution: { type: 'string', maxLength: 400 },
    timeToLive: { type: 'integer' },
  },
  required: ['name', 'resolution'],
  additionalProperties: false,
};
