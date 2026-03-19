import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { TasksCollection } from "./TasksCollection";

Meteor.methods({
  async "tasks.insert"(data) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "Não autorizado");
    }

    check(data, {
      taskName: String,
      taskDescription: String,
      taskDate: String,
    });

    const user = await Meteor.users.findOneAsync(this.userId);

    await TasksCollection.insertAsync({
      name: data.taskName,
      description: data.taskDescription,
      date: new Date(data.taskDate),
      status: "Cadastrada",
      createdAt: new Date(),
      userId: this.userId,
      userName:
        user?.profile?.name ||
        user?.username ||
        user?.emails?.[0]?.address ||
        "Usuário",
    });
  },
});