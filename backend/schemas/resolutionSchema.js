export default {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 20 },
    resolution: { type: 'string', maxLength: 400 },
    expiry: { type: 'integer' },
  },
  required: ['name', 'resolution', 'expiry'],
  additionalProperties: false,
};
