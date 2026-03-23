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
      updatedAt: new Date(),
      userId: this.userId,
      userName:
        user?.profile?.name ||
        user?.username ||
        user?.emails?.[0]?.address ||
        "Usuário",
    });
  },

  async "tasks.update"({ _id, name, description, status, date }) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "Não autorizado");
    }

    check(_id, String);
    check(name, String);
    check(description, String);
    check(status, String);
    check(date, String);

    const task = await TasksCollection.findOneAsync({ _id });

    if (!task) {
      throw new Meteor.Error("not-found", "Tarefa não encontrada");
    }

    if (task.userId !== this.userId) {
      throw new Meteor.Error("access-denied", "Acesso negado");
    }

    await TasksCollection.updateAsync(
      { _id },
      {
        $set: {
          name,
          description,
          status,
          date: new Date(date),
          updatedAt: new Date(),
        },
      }
    );
  },

  async "tasks.delete"({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const task = await TasksCollection.findOneAsync(_id);

    if (!task) {
      throw new Meteor.Error("Task not found.");
    }

    if (task.userId !== this.userId) {
      throw new Meteor.Error("Access denied.");
    }

    return TasksCollection.removeAsync(_id);
  },

  async "tasks.updateStatus"({ _id, status }) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "Não autorizado");
    }

    check(_id, String);
    check(status, String);

    const task = await TasksCollection.findOneAsync({ _id });

    if (!task) {
      throw new Meteor.Error("not-found", "Tarefa não encontrada");
    }

    const currentStatus = task.status;

    const canTransition =
      (currentStatus === "Cadastrada" && status === "Em Andamento") ||
      (currentStatus === "Em Andamento" && status === "Concluída") ||
      status === "Cadastrada";

    if (!canTransition) {
      throw new Meteor.Error("invalid-transition", "Transição de status inválida");
    }

    await TasksCollection.updateAsync(
      { _id },
      {
        $set: { status },
      }
    );
  },
});