import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'USER_NAME_REQUIRED'],
    validate: {
      validator: function (name) {
        return name.length >= 2;
      },
    },
    message: 'NAME_LESS_THAN_TWO_CHARS',
  },
  email: {
    type: String,
    required: [true, 'USER_EMAIL_REQUIRED'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'INVALID_EMAIL',
    },
  },
  password: {
    type: String,
    required: [true, 'USER_PASSWORD_REQUIRED'],
    minLength: [6, 'PASSWORD_MIN_6'],
  },
  role: {
    type: String,
    lowercase: true,
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.verifyPassword = async function (checkingPassword) {
  return await bcrypt.compare(checkingPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
