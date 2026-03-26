import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.publish("tasks", function ({ showCompleted = false, search = "", _id, page = 1 } = {}) {
  if (!this.userId) {
    return this.ready();
  }  

  const visibilityQuery = {
    $or: [
      { isPersonal: { $ne: true } },
      { userId: this.userId },
    ],
  };

  const query = {
    ...visibilityQuery,
  };

  const itemsPerPage = 4;
  const skip = (page - 1) * itemsPerPage;

  if (_id) {
    return TasksCollection.find({
      _id,
      ...visibilityQuery,
    });
  }

  if (!showCompleted) {
    query.status = { $in: ["Cadastrada", "Em Andamento"] };
  }

  if (search && search.trim()) {
    query.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  return TasksCollection.find(query, {
    sort: { createdAt: -1 },
    skip: skip,
    limit: itemsPerPage
  });
});