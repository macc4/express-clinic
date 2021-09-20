/*eslint no-await-in-loop: 0*/

import roles from './source/roles.js';
import specializations from './source/specializations.js';
import doctors from './source/doctors.js';
import passwordUtils from '../../../utils/passwordUtils.js';
import Roles from '../../../utils/roles.js';

const rolesSeeder = async db => {
  for (let i = 0; i < roles.length; i += 1) {
    const { id, title } = roles[i];
    await db.roles.findOrCreate({ where: { title }, defaults: { id, title } });
  }
};

const specializationsSeeder = async db => {
  for (let i = 0; i < specializations.length; i += 1) {
    const { id, title } = specializations[i];
    await db.specializations.findOrCreate({
      where: { title },
      defaults: { id, title },
    });
  }
};

const usersSeeder = async db => {
  for (let i = 0; i < doctors.length; i += 1) {
    const { name, email, password } = doctors[i];
    const hashPassword = await passwordUtils.hashPassword(password);
    const [user] = await db.users.findOrCreate({
      where: { email },
      defaults: { name, email, password: hashPassword },
    });
    user.setRoles([Roles.DOCTOR]);
  }
};

const doctorsSeeder = async db => {
  for (let i = 0; i < doctors.length; i += 1) {
    const { name, specialization, email } = doctors[i];
    const { id: userId } = await db.users.findOne({
      raw: true,
      where: { email },
    });
    const [doctor] = await db.doctors.findOrCreate({
      where: { name },
      defaults: { userId, name },
    });
    doctor.setSpecializations([specialization]);
  }
};

const runSeeders = async db => {
  await rolesSeeder(db);
  await specializationsSeeder(db);
  await usersSeeder(db);
  await doctorsSeeder(db);

  // create a default admin role
  const admin = await db.users.create({
    email: 'admin@gmail.com',
    password: await passwordUtils.hashPassword('12345678'),
    name: 'Admin',
  });
  admin.setRoles(Roles.ADMIN);
};

export default runSeeders;
