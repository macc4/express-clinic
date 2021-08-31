import bcrypt from 'bcryptjs';

export default (sequelize, Sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('patient', 'doctor', 'admin'),
        defaultValue: 'patient',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [8, 30] },
      },
      passwordConfirm: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          samePassword(value) {
            if (this.password !== value) {
              throw new Error('Passwords are not the same');
            }
          },
        },
      },

      passwordChangedAt: {
        type: Sequelize.BIGINT,
      },
    },
    { sequelize, modelName: 'user', timestamps: true },
  );

  // HOOKS
  // hash the password before storing
  User.beforeSave(async user => {
    if (!user.changed('password')) return;

    // Hash the password with cost of 12
    user.password = await bcrypt.hash(user.password, 12);

    // Delete passwordConfirm field
    user.passwordConfirm = undefined;
  });

  // automatically create the Patient instance of the User if the role was selected
  User.afterCreate(async user => {
    if (user.role === 'patient') {
      await sequelize.models.patient.create({ userId: user.id });
    }
  });

  // CLASS METHODS
  User.correctPassword = async function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
  };

  // PROTOTYPE METHODS
  User.prototype.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10,
      );

      return JWTTimeStamp < changedTimeStamp;
    }

    // false means not changed
    return false;
  };

  return User;
};
