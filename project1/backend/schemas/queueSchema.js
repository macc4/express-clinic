export default {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 20 },
    timeToLive: { type: 'integer', minimum: 1 },
  },
  required: ['name'],
  additionalProperties: false,
};
