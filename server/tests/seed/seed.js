/*jshint esversion: 6 */

var {ObjectID} = require('mongodb');
var jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const users = [
  {
    _id: user1Id,
    email: 'something@somewhere.ca',
    password: 'user1psw',
    tokens: [
      {
        access: 'auth',
        token:  jwt.sign({_id: user1Id, access: 'auth'}, 'abc123').toString()
      }
    ]
  },
  {
    _id: user2Id,
    email: 'something@something.else',
    password: 'user2psw',
  }
]

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test to do'
  },
  {
    _id: new ObjectID(),
    text: 'Second test to do'
  },
  {
    _id: new ObjectID(),
    text: 'Third test',
    completed: true,
    completedAt: 333
  }
];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
