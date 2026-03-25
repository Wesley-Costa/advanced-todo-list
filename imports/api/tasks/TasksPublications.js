import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.publish("tasks", function ({ showCompleted = false, _id } = {}) {
  if (!this.userId) {
    return this.ready();
  }

  const visibilityQuery = {
    $or: [
      { isPersonal: { $ne: true } },
      { userId: this.userId },
    ],
  };

  if (_id) {
    return TasksCollection.find({
      _id,
      ...visibilityQuery,
    });
  }

  const query = {
    ...visibilityQuery,
  };

  if (!showCompleted) {
    query.status = { $in: ["Cadastrada", "Em Andamento"] };
  }

  return TasksCollection.find(query, {
    sort: { createdAt: -1 },
  });
});