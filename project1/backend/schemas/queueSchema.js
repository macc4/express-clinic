export default {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 20 },
    timeToLive: { type: 'integer' },
  },
  required: ['name', 'timeToLive'],
  additionalProperties: false,
};
