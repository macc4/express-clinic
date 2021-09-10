import bcrypt from 'bcryptjs';

const verifyPassword = async (candidatePassword, userPassword) => {
  const isValid = await bcrypt.compare(candidatePassword, userPassword);
  return isValid;
};

const hashPassword = async password => {
  // Hash the password with cost of 12
  const hashedPassword = await bcrypt.hash(password, 12);

  return hashedPassword;
};

const comparePasswords = (password, passwordConfirm) => {
  if (password !== passwordConfirm) {
    return false;
  }
  return true;
};

export default { verifyPassword, hashPassword, comparePasswords };
