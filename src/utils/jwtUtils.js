import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const sign = (id, secret, expiry) => {
  const token = jwt.sign({ id }, secret, {
    expiresIn: expiry,
  });

  return token;
};

const decode = async (token, secret) => {
  try {
    const decoded = await promisify(jwt.verify)(token, secret);

    return decoded;
  } catch (error) {
    return undefined;
  }
};

export default { sign, decode };
