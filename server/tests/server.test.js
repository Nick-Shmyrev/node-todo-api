/*jshint esversion: 6 */

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not create todo if no auth token is provided', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(401)
      .end(done);
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      }).end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return a todo doc created by othed user', (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    let id = "invalid ID";

    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not remove a todo created by other user', (done) => {
    let hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return 404 if todo not found', (done) => {
    let id = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    let id = "Invalid ID";

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = 'Updated text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({completed: true, text: text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should not update todo created by other user', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = 'Updated text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({completed: true, text: text})
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[2]._id.toHexString();
    let text = 'Second updated text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({completed: false, text: text})
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let id = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    let id = "Invalid ID";

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123qwerty';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((error) => done(error));
      });

  });

  it('should return validation errors if request is invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'Not a real email', password: '2shrt'})
      .expect(400)
      .end(done);
  });

  it('should not create user if email is not unique', (done) => {
    request(app)
      .post('/users')
      .send({email: users[0].email, password: "No1Cares"})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((error) => done(error));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'Invalid Password'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((error) => done(error));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((error) => done(error));
      });
  });
});
