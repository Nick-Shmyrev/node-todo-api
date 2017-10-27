var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// var newTodo = new Todo({
//   text: '  Create another todo  ',
//   completed: true,
//   completedAt: Date.now()
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (error) => {
//   console.log('Unable to save todo');
// });


// User
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var newUser = new User({
  email: '  email@not.found  '
});

newUser.save().then((doc) => {
  console.log('Saved user', JSON.stringify(doc, undefined, 2));
}, (error) => {
  console.log('Unable to save user', error);
});
