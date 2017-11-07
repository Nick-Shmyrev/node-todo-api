const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59f3f8736b393f6c3ff431a51';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID', todo);
// }).catch((error) => {
//   console.log(`${error.name}: ${error.message}`);
// });

var id = '59f3bc96964684c003fe7d05';

if (!ObjectID.isValid(id)) {
  console.log('User ID is invalid');
}

User.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found');
  }

  console.log('User:', JSON.stringify(user, undefined, 2));
}, (error) => {
  console.log(`${error.name}: ${error.message}`);
});
