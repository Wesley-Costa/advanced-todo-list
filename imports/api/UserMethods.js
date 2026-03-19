import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";

Meteor.methods({
  async "users.register"(data) {
    check(data, {
      name: String,
      email: String,
      password: String,
    });

    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    if (!name) {
      throw new Meteor.Error("invalid-name", "Nome é obrigatório.");
    }

    if (!email) {
      throw new Meteor.Error("invalid-email", "Email é obrigatório.");
    }

    if (!password) {
      throw new Meteor.Error("invalid-password", "Senha é obrigatória.");
    }

    if (password.length < 6) {
      throw new Meteor.Error(
        "invalid-password",
        "A senha deve ter pelo menos 6 caracteres."
      );
    }

    const existingUser = await Accounts.findUserByEmail(email);

    if (existingUser) {
      throw new Meteor.Error("user-exists", "Email já cadastrado.");
    }

    const userId = await Accounts.createUserAsync({
      email,
      password,
      profile: {
        name,
        birthDate: "",
        gender: "",
        company: "",
        photo: "",
      },
    });

    return userId;
  },

  async "users.forgotPassword"(email) {
    check(email, String);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Meteor.Error("invalid-email", "Email é obrigatório.");
    }

    const user = await Accounts.findUserByEmail(normalizedEmail);

    if (!user) {
      throw new Meteor.Error("user-not-found", "Usuário não encontrado.");
    }

    await Accounts.sendResetPasswordEmail(user._id);

    return true;
  },
});