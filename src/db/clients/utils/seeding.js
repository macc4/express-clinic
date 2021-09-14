import roles from './source/roles.js';
import specializations from './source/specializations.js';
import doctors from './source/doctors.js';
import passwordUtils from '../../../utils/passwordUtils.js';

const seeding = async db => {
  for (let i = 0; i < roles.length; i += 1) {
    const { id, role } = roles[i];
    await db.roles.create({ id, role });
  }

  for (let i = 0; i < specializations.length; i += 1) {
    const { id, classifier } = specializations[i];
    await db.specializations.create({ id, classifier });
  }

  for (let i = 0; i < doctors.length; i += 1) {
    const { name, email, password } = doctors[i];
    const hashPassword = await passwordUtils.hashPassword(password);
    const user = await db.users.create({
      name,
      email,
      password: hashPassword,
    });
    user.setRoles([2]);
  }

  for (let i = 0; i < doctors.length; i += 1) {
    const { name, specialization } = doctors[i];
    const doctor = await db.doctors.create({ name });
    doctor.setSpecializations([specialization]);
  }
};

export default seeding;
