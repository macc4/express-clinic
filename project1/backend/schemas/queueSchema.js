export default {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 20 },
  },
  required: ['name'],
  additionalProperties: false,
};
