const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({"_id": '5a0642252800f9a81aad66be'}).then((todo) => {
//   console.log(todo);
// });

Todo.findByIdAndRemove('5a0642252800f9a81aad66be').then((todo) => {
  console.log(todo);
});
