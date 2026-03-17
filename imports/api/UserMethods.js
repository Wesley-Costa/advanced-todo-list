import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";

Meteor.methods({
  async "users.updateUsername"({ username }) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const cleanUsername = username?.trim();

    if (!cleanUsername) {
      throw new Meteor.Error("Username is required.");
    }

    if (cleanUsername.length < 3) {
      throw new Meteor.Error("Username must have at least 3 characters.");
    }

    await Accounts.setUsername(this.userId, cleanUsername);

    return true;
  },

  async "users.register"(data) {
    check(data, {
      name: String,
      email: String,
      password: String,
    });

    const existingUser = Accounts.findUserByEmail(data.email);

    if (existingUser) {
      throw new Meteor.Error('user-exists', 'Email já cadastrado.');
    }

    const userId = Accounts.createUser({
      email: data.email,
      password: data.email,
      profile: {
        name: data.email,
        birthDate: '',
        gender: '',
        photo: '',
      }
    })

    return userId;
  },

  'users.forgotPassword'(email) {
    check(email, String);

    const user = Accounts.findUserByEmail(email);

    if (!user) {
      throw new Meteor.Error('user-not-found', 'Usuário não encontrado.');
    }

    Accounts.sendResetPasswordEmail(user._id);

    return true;
  },
});