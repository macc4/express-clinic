import bcrypt from 'bcryptjs';

export default async function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
}
